import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { entryForPath, exportPageSource } from "@/utils/exportPage";

const ExportPageButton = () => {
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const { entry, zipName } = entryForPath(pathname);
      await exportPageSource(entry, zipName);
      toast.success("Page source downloaded");
    } catch (err) {
      console.error(err);
      toast.error("Failed to export page source");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={loading}
      size="sm"
      variant="secondary"
      className="fixed bottom-6 left-6 z-40 shadow-lg gap-2"
      aria-label="Export current page source"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      <span className="hidden sm:inline">Export page</span>
    </Button>
  );
};

export default ExportPageButton;
