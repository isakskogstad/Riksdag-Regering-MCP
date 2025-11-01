import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

export const AdminSetup = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const { data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user;
    },
  });

  const { data: userRoles, refetch } = useQuery({
    queryKey: ["user-roles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc("get_user_roles_with_emails");

      if (error) throw error;
      return data || [];
    },
  });

  const makeAdmin = async (userId: string) => {
    try {
      const { error } = await supabase.from("user_roles").insert({
        user_id: userId,
        role: "admin",
      });

      if (error) throw error;

      toast({
        title: "Admin-rättigheter tillagda",
        description: "Användaren har nu admin-åtkomst",
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Fel vid tillägg av admin",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const makeSelfAdmin = async () => {
    if (!currentUser) {
      toast({
        title: "Inte inloggad",
        description: "Du måste logga in först",
        variant: "destructive",
      });
      return;
    }
    await makeAdmin(currentUser.id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Admin-hantering
        </CardTitle>
        <CardDescription>
          Ge användare admin-rättigheter för att komma åt admin-panelen
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!currentUser && (
          <div className="p-4 border rounded bg-destructive/10 border-destructive/30">
            <p className="text-sm font-semibold mb-2">
              ⚠️ Du är inte inloggad!
            </p>
            <p className="text-sm mb-3 text-muted-foreground">
              För att få admin-åtkomst måste du först logga in. Steg för steg:
            </p>
            <ol className="text-sm space-y-2 mb-4 list-decimal list-inside text-muted-foreground">
              <li>Gå till startsidan (klicka logotypen)</li>
              <li>Klicka "Logga in för Admin"</li>
              <li>Använd <strong>Magic Link</strong> (rekommenderat) - ange bara din e-post</li>
              <li>Kolla din inbox och klicka på länken</li>
              <li>Kom tillbaka hit och klicka "Ge mig admin-rättigheter"</li>
            </ol>
          </div>
        )}

        {currentUser && (
          <div className="p-4 border rounded bg-success/10 border-success/30">
            <p className="text-sm mb-2 font-semibold">
              ✅ Inloggad som: <strong>{currentUser.email}</strong>
            </p>
            <p className="text-sm mb-4 text-muted-foreground">
              Perfekt! Nu kan du ge dig själv admin-rättigheter. Detta är säkert för första användaren och ger dig full åtkomst till admin-panelen.
            </p>
            <Button onClick={makeSelfAdmin} size="sm" className="w-full sm:w-auto">
              <UserPlus className="h-4 w-4 mr-2" />
              Ge mig admin-rättigheter
            </Button>
          </div>
        )}

        {userRoles && userRoles.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-2">Nuvarande admins:</h3>
            <div className="space-y-2">
              {userRoles.map((role: any) => (
                <div
                  key={role.id}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <span className="text-sm">{role.email || role.user_id}</span>
                  <span className="text-xs text-muted-foreground uppercase">
                    {role.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};