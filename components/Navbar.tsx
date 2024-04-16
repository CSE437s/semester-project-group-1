// import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "./ui/navigation-menu";

// import { Button } from "./ui/button";
import { Home } from 'lucide-react'
import Link from 'next/link'
import { ProfileDropdown } from './ProfileDropdown'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from '@/components/ui/navigation-menu'
import {
  type User,
  useSupabaseClient,
  useUser,
} from '@supabase/auth-helpers-react'

export default function Navbar() {
  // Get supabase user
  const sb = useSupabaseClient()
  const user: User | null = useUser()
  // If user isn't logged in, don't show settings button

  return (
    <div className='flex h-16 w-full flex-row items-center justify-between border-b border-gray-200 bg-white'>
      <div className='flex flex-row items-center'>
        <div className='ml-4 flex flex-row items-center'>
          {/* <img className="h-8 w-8 mr-2" src="/images/logo.svg" alt="logo" /> */}
          {/* <Link href="/studios">
                        <div className="text-2xl font-bold ml-4"><Home /></div>
                    </Link> */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationMenuLink>Link</NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>

      <div className='flex flex-row items-center'>
        <div className='mr-4 flex flex-row items-center'>
          {user && <ProfileDropdown />}
        </div>
      </div>
    </div>
  )
}
