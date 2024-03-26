# User Testing Notes

## Beta User Testing

16 Users total including Raj (our TA) and Emily (Head TA)

---

User: Raj Thakkar

In Class Our TA

Notes:

- I tried to put in SFO as an airport choice in the flight search but was unable to find it. If the API, you are using doesn't have all airports then this isn't really a big deal but would be nice if having all major airports available is possible
- When I select an airport from the dropdown in the input search, however it would be nice if the dropdown disappeared onSelect
  When I use input search on a wider date range (say a month), instead of showing all the results it shows the first 6 results which I imagine is because that is the maximum number of cards that fit into my screen width, however there is no way to scroll or see the flights queried past the first 6 results. Would be great if queries with > 6 results showed as multiple rows or as a flex scroll as you guys did on the saved flights container
- I did an input search of LAX to O'Hare with the dates of Match 25 - May 9 and the software returned no results which I think could be a bug since I feel there should be at least a few results. I did the query after already querying ATL - O'Hare which could help you potentially recreate the error. The Console states that it was a 500 error on /api/get-availability line 1
- Also, when I did that LAX query, my saved container still showed flights that I had saved for ATL - O'Hare. As a user, I would expect my saved container to only show flights I have saved for the route I am querying for on input search however the lack of update could have been attributed to the fact that an error was returned in the get availability function
- As far as saving flights, I think a button could be good here. When I dragged some flights into the box and went to my saved flights it did not immediately refresh. I think a good workaround here would be to have a "Save Flights" button which confirms the flights I want to save rather than saving everything I drag which would help the user confirm the flights they are saving as well as allow you to run the save function on the button press
- I'm stoked to see you guys implemented a LLM query feature. Unfortunately, the functionality did not work for me. When I queried "Tropical Spring Break", I did not see any state change and was met with a 504 error in the console at /api/get-flights-basic line 1. Would fix this by tomorrow so you can demo the feature as I'm sure it's a small bug
- Small thing, but on the query search, I would put some confirmation on how to search. I assumed it was press enter to search similar to ChatGPT, but a small subtext below the search bar would clarify/a search button to make sure I know my query is in progress. Also add loading state here
- The points related to the cost of the flights are a little confusing to me. I believe the API you are referring to may be for flights related to some flight reward system which is fine for the purposes of this class. However, for the demo if you could convert the points to dollars, I think that would be better as that is what the user is accustomed to even if the conversion of points to dollars may not be exactly 1:1. If you can find the exact conversion to price, even better.
- On the saved flights page, for the sake of a consistent UI I would show the cards as flex-wrap rows similar to how you do on the input search. Right now, they appear as individual columns stacked on each other 1 by 1 which can create a poor experience if a user has 10+ flights saved and has to scroll instead of being able to glance at all of them on a singular page size. Would also be nice if saved flights were separated by routes if a potential user was planning multiple trips and wanted to compare their saved flights for different routes.

---

User: Emily Sheehan

In Class Head TA

Notes:

- I agree that I really like the updates to the UI.

- When I tried to find flights via input search, I couldn't find major airports like Boston Logan or Lambert. I also couldn't scroll through the drop down menu for departure/arrival airports, so could only see the first few results in alphabetical order. It would be nice to make this smaller and scrollable. I also agree that the drag and drop isn't necessarily intuitive. Maybe position the saved flights box next to the flight results tab so that you can compare what you have saved to the current query. Also, for user experience maybe substitute the airline code with the actual name to make it easier for customers to purchase tickets (ex. DL --> Delta).

- The Query Search isn't working at all for me. I've tried "I want to go from Boston to any city in Europe in May" and a few others and nothing is loading.

- For saved flights, maybe add a calendar view where you can see where the different flights are timewise. You could have different views (day, week, month) to compare. Maybe you can also pull data about how often that route is on time, delayed, what type of aircraft, etc. You could use the flight aware API: https://www.flightaware.com/commercial/data/

---

User: Linus Dannull

In Class

Notes:

- The AI query search is very unintutive. There should be a loading field, and some indication that we know this is happening
- Login screen OTP behaves weirdly

---

User: Geoffrey Lien

In Class

Notes:

- OTP on login screen errors out after your press sign in
- Mobile view could use some tweaking in terms of spacing

---

User: Elysia Quah

In Class

Notes:

- No indication that you can scroll on the flight cart, maybe an arrow would help?
- Log out page seems styled a bit differently than the rest. Need more conformity

---

User: Vishal Agarwal

In Class

Notes:

- Loves the drag feature, wishes it was more user friendly
- Agrees that the AI query doesn't work as intended and some tweaking should be involved to bring it up to scale

---

User: Anton Young

In Class

Notes:

- Flight cards could be be better designed and contain a bit more information. For example, the airline codes are a bit hard to understand, so displaying the arline name in plaintext might help with this a lot and make it easier
- It's not clear that there are no flight results when you search up obscure locations

---

User: Will Triantis

In Class

Notes:

- Wants to see a better user experience over all. Finds as though this product was built by software engineers for software engineers, but some ui tweaks can make this a lot better
- Likes the color scheme, and the features that we have planned on implementing

---

User: Lucas Abrams

Out of Class

Notes:

- Thinks saved flights could be handled better. He thinks organizing based on location or by date or other filters could make this page more useful than what it currently is.

---

User: Jake Oscherwitz

Out of Class

Notes:

- Big fan of the app and loves the ai feature. Wants the cards to be a bit more clearer as to the destination of the location. Airport codes are hard to understand
- Thinks there should be better error handling for when there are no flights returned

---

User: Alexander Demeris

Out of Class

Notes:

- Not a fan of the input search and the premise of seaching for one way flights. He doesn't think it was clear enough that we were searching only for one way flights since the date range makes it seem like it is a round trip

---

User: Ben Modiano

Out of Class

Notes:

- Said optimizations we planned on making weren't that appealing, requests are already fast enough
- Probably no need for a caching layer

---

User: Daniel Palmer

Out of Class

Notes:

- Pointed out the lack of feedback when submitting a flight search query, causing uncertainty if the search was successful
- Recommended adding a loading spinner or status message to indicate when the search is processing and when results are ready

---

User: Roberto Panora

Out of Class

Notes:

- Likes the save for later and the pop ups that indicate something was successful, thanks that makes the experience better
- Wants to see more information for a particular flight

---

User: Nick Sullivan

Out of Class

Notes:

- Doesn't know why there are so few airports to choose from. Thinks that we should add many more airports as well as potentially expand internationally
- Wants to see the ai stuff come to fruition

---

User: Dorian Marr

Out of Class

Notes:

- Said similar things to Ben, likes the idea of GPT-influenced queries but it already seems fast enough
- Better UX is probably enough to get the improvements we want instead of speeding up the actual database layers
