"use client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const brands = ["Bajaj", "Triumph", "Vespa", "Tata"];

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const currentBrand = pathname.split("/")[2];

  return (
    <div className="w-64 bg-gray-800 text-white h-screen sticky p-4 mr-1">
      <Link href="/" className="text-lg font-bold">
        Retro_App
      </Link>

      <Separator className="my-4" />
      <h2 className="text-md font-semibold my-4">Brands</h2>
      <ul className="space-y-2">
        {brands.map((brand) => (
          <li key={brand}>
            <Link href={`/brands/${brand}`}>
              <span
                className={`block p-2 rounded ${
                  currentBrand === brand ? "bg-gray-600" : "hover:bg-gray-700"
                }`}
              >
                {brand}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
