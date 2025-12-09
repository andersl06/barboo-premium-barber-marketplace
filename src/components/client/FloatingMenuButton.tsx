import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClientMenuDrawer } from "./ClientMenuDrawer";

export const FloatingMenuButton = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setDrawerOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-navy hover:bg-navy-lighter shadow-lg hover:shadow-xl transition-all z-40"
        size="icon"
        aria-label="Abrir menu"
      >
        <Menu className="w-6 h-6 text-white" />
      </Button>

      <ClientMenuDrawer 
        open={drawerOpen} 
        onOpenChange={setDrawerOpen} 
      />
    </>
  );
};