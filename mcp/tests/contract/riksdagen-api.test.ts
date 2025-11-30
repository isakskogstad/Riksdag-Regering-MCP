/**
 * Riksdagen API Contract Tests
 *
 * Validates that Riksdagen's API endpoints are available and returning expected structure.
 * These tests run daily via GitHub Actions to detect API changes early.
 */

import { describe, it, expect } from '@jest/globals';

const API_BASE = 'https://data.riksdagen.se';
const DEFAULT_TIMEOUT = 30000;

describe('Riksdagen API Contract', () => {
  describe('Document List API', () => {
    it('should return valid document list response', async () => {
      const url = `${API_BASE}/dokumentlista/?utformat=json&sz=5&p=1`;
      const response = await fetch(url);

      expect(response.ok).toBe(true);
      expect(response.headers.get('content-type')).toContain('application/json');

      const data = await response.json() as any;
      expect(data).toHaveProperty('dokumentlista');
      expect(data.dokumentlista).toHaveProperty('dokument');
      expect(Array.isArray(data.dokumentlista.dokument)).toBe(true);
      expect(data.dokumentlista.dokument.length).toBeGreaterThan(0);

      // Validate document structure
      const firstDoc = data.dokumentlista.dokument[0];
      expect(firstDoc).toHaveProperty('dok_id');
      expect(firstDoc).toHaveProperty('doktyp');
      expect(firstDoc).toHaveProperty('rm');
      expect(firstDoc).toHaveProperty('titel');
    }, DEFAULT_TIMEOUT);

    it('should support document type filtering', async () => {
      const url = `${API_BASE}/dokumentlista/?doktyp=prop&utformat=json&sz=5`;
      const response = await fetch(url);

      expect(response.ok).toBe(true);
      const data = await response.json() as any;
      expect(data.dokumentlista.dokument.length).toBeGreaterThan(0);

      // All documents should be propositions
      data.dokumentlista.dokument.forEach((doc: any) => {
        expect(doc.doktyp).toBe('prop');
      });
    }, DEFAULT_TIMEOUT);
  });

  describe('Speech List API', () => {
    it('should return valid speech list response', async () => {
      const url = `${API_BASE}/anforandelista/?utformat=json&sz=5&p=1`;
      const response = await fetch(url);

      expect(response.ok).toBe(true);
      expect(response.headers.get('content-type')).toContain('application/json');

      const data = await response.json() as any;
      expect(data).toHaveProperty('anforandelista');
      expect(data.anforandelista).toHaveProperty('anforande');
      expect(Array.isArray(data.anforandelista.anforande)).toBe(true);
      expect(data.anforandelista.anforande.length).toBeGreaterThan(0);

      // Validate speech structure
      const firstSpeech = data.anforandelista.anforande[0];
      expect(firstSpeech).toHaveProperty('anforande_id');
      expect(firstSpeech).toHaveProperty('intressent_id');
      expect(firstSpeech).toHaveProperty('parti');
    }, DEFAULT_TIMEOUT);
  });

  describe('Voting List API', () => {
    it('should return valid voting list response', async () => {
      const url = `${API_BASE}/voteringlista/?utformat=json&sz=5&p=1&sort=datum`;
      const response = await fetch(url);

      expect(response.ok).toBe(true);
      expect(response.headers.get('content-type')).toContain('application/json');

      const data = await response.json() as any;
      expect(data).toHaveProperty('voteringlista');
      expect(data.voteringlista).toHaveProperty('votering');
      expect(Array.isArray(data.voteringlista.votering)).toBe(true);
      expect(data.voteringlista.votering.length).toBeGreaterThan(0);

      // Validate voting structure
      const firstVote = data.voteringlista.votering[0];
      expect(firstVote).toHaveProperty('votering_id');
      expect(firstVote).toHaveProperty('intressent_id');
      expect(firstVote).toHaveProperty('rost');
    }, DEFAULT_TIMEOUT);
  });

  describe('Member List API', () => {
    it('should return valid member list response', async () => {
      const url = `${API_BASE}/personlista/?utformat=json&sz=10&rdlstatus=samtliga&sort=sorteringsnamn&sortorder=asc`;
      const response = await fetch(url);

      expect(response.ok).toBe(true);
      expect(response.headers.get('content-type')).toContain('application/json');

      const data = await response.json() as any;
      expect(data).toHaveProperty('personlista');
      expect(data.personlista).toHaveProperty('person');
      expect(Array.isArray(data.personlista.person)).toBe(true);
      expect(data.personlista.person.length).toBeGreaterThan(0);

      // Validate member structure
      const firstPerson = data.personlista.person[0];
      expect(firstPerson).toHaveProperty('intressent_id');
      expect(firstPerson).toHaveProperty('tilltalsnamn');
      expect(firstPerson).toHaveProperty('efternamn');
      expect(firstPerson).toHaveProperty('parti');
    }, DEFAULT_TIMEOUT);
  });

  describe('Calendar List API', () => {
    it('should return valid calendar response', async () => {
      const today = new Date().toISOString().split('T')[0];
      const url = `${API_BASE}/kalenderlista/?from=${today}&sz=5&utformat=json`;
      const response = await fetch(url);

      expect(response.ok).toBe(true);

      // Note: This endpoint sometimes returns HTML instead of JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json() as any;
        expect(data).toHaveProperty('kalender');

        if (data.kalender && Array.isArray(data.kalender)) {
          expect(data.kalender.length).toBeGreaterThanOrEqual(0);
        }
      } else {
        // If HTML response, just verify it's not an error
        const text = await response.text();
        expect(text.length).toBeGreaterThan(0);
      }
    }, DEFAULT_TIMEOUT);
  });

  describe('Grouped Voting API', () => {
    it('should return valid grouped voting response', async () => {
      const url = `${API_BASE}/voteringlistagrupp/?utformat=json&sz=50`;
      const response = await fetch(url);

      expect(response.ok).toBe(true);
      expect(response.headers.get('content-type')).toContain('application/json');

      const data = await response.json() as any;
      // The API returns 'voteringlista' with gruppering attribute, not 'voteringlistagrupp'
      expect(data).toHaveProperty('voteringlista');
      expect(data.voteringlista).toBeDefined();

      // Verify it's a grouped response
      if (data.voteringlista['@gruppering']) {
        expect(data.voteringlista['@gruppering']).toBe('true');
      }
    }, DEFAULT_TIMEOUT);
  });

  describe('API Performance', () => {
    it('should respond within acceptable time (< 5s)', async () => {
      const startTime = Date.now();
      const url = `${API_BASE}/dokumentlista/?utformat=json&sz=5`;

      await fetch(url);

      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(5000);
    }, 10000);
  });

  describe('Error Handling', () => {
    it('should handle invalid document type gracefully', async () => {
      const url = `${API_BASE}/dokumentlista/?doktyp=INVALID_TYPE&utformat=json&sz=5`;
      const response = await fetch(url);

      // Should still return 200 with empty results
      expect(response.ok).toBe(true);
      const data = await response.json() as any;
      expect(data.dokumentlista).toBeDefined();
    }, DEFAULT_TIMEOUT);
  });
});
