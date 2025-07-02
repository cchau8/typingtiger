import {
    Sidebar,
    SidebarHeader,
    SidebarProvider,
} from "@/components/ui/sidebar";

const Admin = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-muted">
            <div className="flex items-center justify-center">
                <SidebarProvider>
                    <Sidebar
                        // variant="floating"
                        className="w-64 rounded-lg shadow-lg bg-background"
                    >
                        <SidebarHeader>hello</SidebarHeader>
                    </Sidebar>
                </SidebarProvider>
            </div>
        </div>
    );
};

export default Admin;
