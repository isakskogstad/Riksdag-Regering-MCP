# Riksdag-Regering.AI 🏛️

MCP Server för AI-assistenter att hämta och analysera data från Sveriges Riksdag och Regeringskansliet.

## ✨ Funktioner

**MCP Server** - Remote deployment på Render.com
- ✅ 27 verktyg för sök, analys och jämförelser
- ✅ 5 resurser med strukturerad data
- ✅ 4 AI-guidade prompts
- ✅ JSON-RPC 2.0 protokoll
- ✅ Kompatibel med Claude Code, ChatGPT, Gemini, Cursor, VS Code Copilot

**Datakällor:**
- Sveriges Riksdag (ledamöter, dokument, anföranden, voteringar)
- Regeringskansliet (pressmeddelanden, propositioner, SOU)

## 🚀 Använd MCP Server

### Claude Code

```bash
claude mcp add riksdag-regering \
  --transport http \
  https://riksdag-regering-ai.onrender.com/mcp
```

### ChatGPT

1. Öppna [ChatGPT Actions](https://platform.openai.com/docs/actions)
2. Lägg till MCP server: `https://riksdag-regering-ai.onrender.com/mcp`
3. Se [CHATGPT_GUIDE.md](CHATGPT_GUIDE.md)

### Manual konfiguration

```json
{
  "mcpServers": {
    "riksdag-regering": {
      "transport": "http",
      "url": "https://riksdag-regering-ai.onrender.com/mcp"
    }
  }
}
```

## 🛠️ Lokal installation

```bash
# Klona repo
git clone https://github.com/KSAklfszf921/Riksdag-Regering.AI.git
cd Riksdag-Regering.AI/mcp

# Installera
npm install

# Konfigurera
cp .env.example .env
# Lägg till SUPABASE_URL och SUPABASE_ANON_KEY

# Bygg och kör
npm run build
npm start
```

## 📚 Dokumentation

- [MCP Server README](mcp/README.md) - Fullständig dokumentation
- [ChatGPT Guide](CHATGPT_GUIDE.md) - ChatGPT integration
- [Remote MCP Guide](REMOTE_MCP_GUIDE.md) - Deployment guide
- [Security](SECURITY.md) - Säkerhetspolicy

## 🧪 Testa servern

```bash
curl -X POST https://riksdag-regering-ai.onrender.com/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
```

## 🔗 Länkar

- **Live MCP Server**: https://riksdag-regering-ai.onrender.com/mcp
- **GitHub**: https://github.com/KSAklfszf921/Riksdag-Regering.AI
- **MCP Protocol**: https://modelcontextprotocol.io/

## 📄 Licens

MIT License - Se [LICENSE](LICENSE)

---

**v2.0.0** - Full MCP JSON-RPC 2.0 support med prompts, ping och förbättrad kompatibilitet
