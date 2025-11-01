import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { LogIn, Mail } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [magicEmail, setMagicEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMagicLoading, setIsMagicLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const redirectUrl = `${window.location.origin}/`;
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
          },
        });

        if (error) throw error;

        // Check if email confirmation is disabled (instant login)
        if (data.session) {
          toast({
            title: "Konto skapat och inloggad!",
            description: "Du är nu inloggad.",
          });
          navigate("/");
        } else {
          toast({
            title: "Konto skapat!",
            description: "E-postbekräftelse krävs. Kontrollera din inkorg eller inaktivera 'Confirm email' i Supabase-inställningarna för snabbare utveckling.",
          });
          setIsSignUp(false); // Switch to login view
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          // Provide more helpful error message
          if (error.message.includes("Invalid login credentials")) {
            throw new Error("Felaktigt e-post eller lösenord. Om du precis registrerade dig, kontrollera om du behöver bekräfta din e-post först.");
          }
          throw error;
        }

        toast({
          title: "Inloggad!",
          description: "Du är nu inloggad.",
        });

        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Fel",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsMagicLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.signInWithOtp({
        email: magicEmail,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) throw error;

      toast({
        title: "Magic Link skickad!",
        description: "Kolla din e-post och klicka på länken för att logga in.",
      });
    } catch (error: any) {
      toast({
        title: "Fel",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsMagicLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LogIn className="h-5 w-5" />
            Logga in
          </CardTitle>
          <CardDescription>
            Välj inloggningsmetod för att komma åt admin-panelen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="magic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="magic">
                <Mail className="h-4 w-4 mr-2" />
                Magic Link
              </TabsTrigger>
              <TabsTrigger value="password">Lösenord</TabsTrigger>
            </TabsList>

            <TabsContent value="magic" className="space-y-4">
              <div className="p-3 bg-success/10 border border-success/30 rounded text-sm">
                <p className="font-semibold mb-2">✨ Rekommenderat!</p>
                <p className="text-muted-foreground text-xs">
                  Ange din e-post så skickar vi en magic link. Klicka på länken i din inbox för att logga in automatiskt - inget lösenord behövs!
                </p>
              </div>
              
              <form onSubmit={handleMagicLink} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Din e-postadress"
                  value={magicEmail}
                  onChange={(e) => setMagicEmail(e.target.value)}
                  required
                />
                <Button type="submit" className="w-full" disabled={isMagicLoading}>
                  {isMagicLoading ? "Skickar..." : "Skicka Magic Link"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="password" className="space-y-4">
              <form onSubmit={handleAuth} className="space-y-4">
                {!isSignUp && (
                  <div className="p-3 bg-info/10 border border-info/20 rounded text-sm">
                    <p className="text-info-foreground">
                      <strong>Tips:</strong> Prova Magic Link om du har problem med lösenordsinloggning.
                    </p>
                  </div>
                )}
                
                <div>
                  <Input
                    type="email"
                    placeholder="E-post"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="Lösenord (minst 6 tecken)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Laddar..." : isSignUp ? "Skapa konto" : "Logga in"}
                </Button>
                <Button
                  type="button"
                  variant="link"
                  className="w-full"
                  onClick={() => setIsSignUp(!isSignUp)}
                >
                  {isSignUp
                    ? "Har du redan ett konto? Logga in"
                    : "Inget konto? Skapa ett"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
