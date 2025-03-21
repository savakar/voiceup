
import { Link } from "@heroui/link";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
} from "@heroui/navbar";
import { RiMic2AiFill } from "react-icons/ri"

export const Navbar = () => {
  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <Link
            className="flex justify-start items-center gap-1"
            color="foreground"
            href="/"
          >
            <RiMic2AiFill className="text-lg" />
            <p className="font-bold text-inherit">Speechless</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>
      
    </HeroUINavbar>
  );
};
