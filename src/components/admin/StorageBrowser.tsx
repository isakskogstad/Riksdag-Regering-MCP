import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Folder, File, Search, Trash2, ExternalLink, ChevronRight, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FileNode {
  name: string;
  path: string;
  size?: number;
  isFolder: boolean;
  children?: FileNode[];
}

const StorageBrowser = () => {
  const [selectedBucket, setSelectedBucket] = useState<string>('regeringskansliet-files');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const { data: files, isLoading, refetch } = useQuery({
    queryKey: ['storage-browser', selectedBucket],
    queryFn: async () => {
      const { data, error } = await supabase.storage.from(selectedBucket).list('', {
        limit: 1000,
        sortBy: { column: 'name', order: 'asc' }
      });

      if (error) throw error;

      // Build file tree
      const tree: FileNode[] = [];
      
      for (const item of data || []) {
        const parts = item.name.split('/');
        let current = tree;
        
        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];
          const isLast = i === parts.length - 1;
          
          let existing = current.find(n => n.name === part);
          
          if (!existing) {
            existing = {
              name: part,
              path: parts.slice(0, i + 1).join('/'),
              isFolder: !isLast,
              size: isLast ? (item.metadata?.size || 0) : undefined,
              children: []
            };
            current.push(existing);
          }
          
          if (!isLast && existing.children) {
            current = existing.children;
          }
        }
      }

      return tree;
    },
  });

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const deleteFile = async (path: string) => {
    try {
      const { error } = await supabase.storage.from(selectedBucket).remove([path]);
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

  const formatBytes = (bytes: number = 0) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const renderNode = (node: FileNode, level: number = 0) => {
    const isExpanded = expandedFolders.has(node.path);
    const matchesSearch = searchQuery === '' || 
      node.name.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch && !node.isFolder) return null;

    return (
      <div key={node.path}>
        <div 
          className="flex items-center gap-2 py-2 px-2 hover:bg-accent rounded-md cursor-pointer"
          style={{ paddingLeft: `${level * 20 + 8}px` }}
          onClick={() => node.isFolder && toggleFolder(node.path)}
        >
          {node.isFolder ? (
            <>
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              <Folder className="h-4 w-4 text-warning" />
              <span className="flex-1 text-sm font-medium">{node.name}</span>
              <Badge variant="outline" className="text-xs">
                {node.children?.length || 0} items
              </Badge>
            </>
          ) : (
            <>
              <div className="w-4" />
              <File className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 text-sm">{node.name}</span>
              <span className="text-xs text-muted-foreground">{formatBytes(node.size)}</span>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`https://kufkpsoygixjaotmadvw.supabase.co/storage/v1/object/public/${selectedBucket}/${node.path}`, '_blank');
                  }}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteFile(node.path);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </>
          )}
        </div>
        {node.isFolder && isExpanded && node.children && (
          <div>
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Storage Browser</span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={selectedBucket === 'regeringskansliet-files' ? 'default' : 'outline'}
              onClick={() => setSelectedBucket('regeringskansliet-files')}
            >
              Regeringskansliet
            </Button>
            <Button
              size="sm"
              variant={selectedBucket === 'riksdagen-images' ? 'default' : 'outline'}
              onClick={() => setSelectedBucket('riksdagen-images')}
            >
              Riksdagen
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Sök filer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Alert>
            <AlertDescription>
              Klicka på mappar för att expandera. Använd ikoner för att öppna eller radera filer.
            </AlertDescription>
          </Alert>

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Laddar filer...</div>
          ) : (
            <div className="border rounded-lg max-h-[600px] overflow-y-auto">
              {files?.map(node => renderNode(node))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StorageBrowser;
