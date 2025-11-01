import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Folder, File, Search, Trash2, ExternalLink, ChevronRight, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

const StorageBrowserImproved = () => {
  const [selectedBucket, setSelectedBucket] = useState<string>('regeringskansliet-files');
  const [currentPath, setCurrentPath] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const { data: items, isLoading, refetch } = useQuery({
    queryKey: ['storage-browser-improved', selectedBucket, currentPath],
    queryFn: async () => {
      const { data, error } = await supabase.storage
        .from(selectedBucket)
        .list(currentPath || '', {
          limit: 100,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (error) throw error;
      return data || [];
    },
  });

  const deleteFile = async (path: string) => {
    const fullPath = currentPath ? `${currentPath}/${path}` : path;
    try {
      const { error } = await supabase.storage.from(selectedBucket).remove([fullPath]);
      if (error) throw error;

      toast({
        title: "Fil raderad",
        description: `${path} har tagits bort`,
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "Fel",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const navigateToFolder = (folderName: string) => {
    const newPath = currentPath ? `${currentPath}/${folderName}` : folderName;
    setCurrentPath(newPath);
  };

  const navigateToBreadcrumb = (index: number) => {
    const pathParts = currentPath.split('/').filter(Boolean);
    const newPath = pathParts.slice(0, index + 1).join('/');
    setCurrentPath(newPath);
  };

  const formatBytes = (bytes: number = 0) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const filteredItems = items?.filter(item => 
    searchQuery === '' || item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pathParts = currentPath.split('/').filter(Boolean);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>📁 Storage Browser</span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={selectedBucket === 'regeringskansliet-files' ? 'default' : 'outline'}
              onClick={() => {
                setSelectedBucket('regeringskansliet-files');
                setCurrentPath('');
              }}
            >
              Regeringskansliet
            </Button>
            <Button
              size="sm"
              variant={selectedBucket === 'riksdagen-images' ? 'default' : 'outline'}
              onClick={() => {
                setSelectedBucket('riksdagen-images');
                setCurrentPath('');
              }}
            >
              Riksdagen
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Sök filer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Breadcrumb navigation */}
          <div className="flex items-center gap-2 flex-wrap text-sm">
            <Button 
              variant="ghost" 
              size="sm"
              className="h-7 px-2"
              onClick={() => setCurrentPath('')}
            >
              <Home className="h-3 w-3 mr-1" />
              Root
            </Button>
            {pathParts.map((part, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => navigateToBreadcrumb(idx)}
                >
                  {part}
                </Button>
              </div>
            ))}
          </div>

          <Alert>
            <AlertDescription className="text-xs">
              Klicka på mappar för att navigera. Använd ikoner för att öppna eller radera filer.
            </AlertDescription>
          </Alert>

          {/* Files list */}
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="border rounded-lg max-h-[500px] overflow-y-auto">
              {filteredItems && filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const isFolder = item.id === null;
                  
                  return (
                    <div 
                      key={item.name}
                      className="flex items-center gap-3 p-3 hover:bg-accent border-b last:border-b-0 cursor-pointer"
                      onClick={() => isFolder && navigateToFolder(item.name)}
                    >
                      {isFolder ? (
                        <>
                          <Folder className="h-5 w-5 text-warning flex-shrink-0" />
                          <span className="flex-1 font-medium">{item.name}</span>
                          <Badge variant="outline" className="text-xs">Mapp</Badge>
                        </>
                      ) : (
                        <>
                          <File className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          <span className="flex-1 text-sm truncate">{item.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatBytes(item.metadata?.size)}
                          </span>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                const fullPath = currentPath ? `${currentPath}/${item.name}` : item.name;
                                window.open(
                                  `https://kufkpsoygixjaotmadvw.supabase.co/storage/v1/object/public/${selectedBucket}/${fullPath}`,
                                  '_blank'
                                );
                              }}
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteFile(item.name);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {searchQuery ? 'Inga filer matchar sökningen' : 'Mappen är tom'}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StorageBrowserImproved;
