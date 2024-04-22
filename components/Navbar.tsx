import { ProfileDropdown } from './ProfileDropdown'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { type User, useUser } from '@supabase/auth-helpers-react'

import React, { type ReactElement } from 'react'

export default function Navbar(): ReactElement {
  const user: User | null = useUser()
  // If user isn't logged in, don't show settings button

  return (
    <div className='flex h-16 w-full flex-row items-center justify-between border-b border-gray-200 bg-white'>
      <div className='flex flex-row items-center'>
        <div className='ml-4 flex flex-row items-center'>
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
          {user != null && <ProfileDropdown />}
        </div>
      </div>
    </div>
  )
}
