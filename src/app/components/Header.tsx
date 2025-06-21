import DarkModeToggle from "@/components/header/DarkModeToggle";
import LogoutButton from "@/components/auth/LogoutButton";
import GoToGameButton from "@/components/header/GoToGameButton";
import DevModeToggle from "@/components/header/DevModeToggle";

const Header = () => (
    <header className="m-10 flex justify-between">
        <div className="flex flex-row gap-2">
            <span className="text-2xl">TypingTiger</span>
            <GoToGameButton />
        </div>
        <div className="flex gap-2">
            <DevModeToggle />
            <DarkModeToggle />
            <LogoutButton />
        </div>
    </header>
);

export default Header;
