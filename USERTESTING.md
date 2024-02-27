# User Testing Notes

## MVP

> Note: We had a very barebones app when we did user testing last week. All we had was a swagger API. Since then we built our frontend, added auth, and out CI/CD pipeline. 

User: Linus Dannull

In-Class

Notes:
- There's only an API route, no frontend that consumes it. The app could really use a frontend!
- User suggested as a first draft we create a clone of expedia or google flights in order to integrate the API testing.

---
User: Elysia Quah

In-Class

Notes:
- There's no authentication for the API -- anyone with the URL can make queries
- We added user authentication in the frontend with supabase. In this interation of our project, API requests to our azure server are still actually unauthenticated, but this is going to change in our next iteration.
- Liked how Supabase handles passwordless auth (did hackwashu -- knows how the auth workflow is handled). 

---
User: Geoffrey Lien

In-Class

Notes:
- Likes the idea of adding AI features into the app to automate the search queries, but doesn't think that a chatGPT-like interface would be a good fit
- Liked the idea of using cards to represent flights instead of the classic table or list view.

---
User: Jonathan Lin

In-Class

Notes:
- User hates needing to open multiple tabs in order to make multiple flight searches
- Suggested a "save for later" feature that lets a user come back to their previous flights or search queries instead of needing to remember them -- Expedia and Google Flights don't have this feature

---
User: Ben Mueller

In-Class

Notes:
- Said optimizations we planned on making weren't that appealing, requests are already fast enough
- Probably no need for a caching layer

---
User: Jebron Perkins

In-Class

Notes:
- Pointed out the lack of feedback when submitting a flight search query, causing uncertainty if the search was successful
- Recommended adding a loading spinner or status message to indicate when the search is processing and when results are ready

---
User: Ethan Leifert

In-Class

Notes:
- Flight search goes off the page, wants a way to search & filter (or at least scroll) flight options
- Proposed creating a filter interface and providing clearer descriptions for each filtering criterion
- Wants more data on suggested flights

---
User: Jake Valentine

In-Class

Notes:
- Supabase login email got sent to spam in WUSTL email
- Would prefer a magic link instead of a code, but a code is good enough
- Would be nice to store a cookie to automate repeated logins on the same device instead of needing to send an email every time. Look into supabase to see if there's a way to bypass.

---
User: Sophie Leong

Outside of Class

Notes:
- Found bug that log out button doesn't redirect back to the login page
- Extra home button in the top left copied over from Will's base auth app
- Fixed by resolving both bugs!

---
User: Peeti Sithiyopasakul

Outside of Class

Notes:
- Said similar things to Ben, likes the idea of GPT-influenced queries but it already seems fast enough
- Better UX is probably enough to get the improvements we want instead of speeding up the actual database layers

---
User: Peter Jakeila

Outside of Class

Notes:
- Flight display is ugly, should be fixed in next iteration.
- Possibly as cards? Should show airline data + time + connections

---
User: Mateo Hain

Outside of Class

Notes:
- Not all airports listed, where's STL?
- Likes how text input is clearly searchable but also scrollable -- this feature is missing from google flights + expedia. Feels more responsive than those sites
- Likes how flight requests aren't peppered with ads and don't take as long to load. Wishes that they were laid out better in a table
- Takeaway: need to improve UX

---
User: JP Torack

Outside of Class

Notes:
- No flight selection flow, what's next after the flights are found?
- Missing data like flight numbers + departure times
- Likes the idea of more complex searches, automating them with a chat bot
- Would love to be able to search for an arbitrary number of airports

---
User: Gus Gerlach

Outside of class

Notes:
- Tested app on phone, not mobile responsive at all
- Not sure if we want to worry about mobile responsiveness, even for beta. Maybe have some kind of limited functionality option?
- Flight display is barely passable even on desktop -- need to fix for beta

---
User: Donovan Gillen

Outside of class

Notes:
- Not a fan of the base shadcn ui. WOuld like more colors or some customizability thrown in
- Flying and traveling should be fun, not like a cookie-cutter AI start up site
- Adding full-page transitions could help, a progress bar?

---
User: Ben Modiano

Outside of class

Notes:
- When Ben used the app, our API domain had been blocked by infosec for being a new domain on the WUSTL network. Submitted an infosec item to get it unblocked
- As part of this, we realized the app had very little graceful error handling. On an error it wouldn't give a reason and we had to dig into the console to find out
- Error handling could be even better, but is OK as a javascript alert for now