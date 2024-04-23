# User Testing Notes

## Final User Testing


User: Raj
- Semantic search doesn't work 100% the way you'd expect, remove the hard limiting from STL flights to be dynamic based on the query.
- Add flight timing to the semantic search instead of it just being based on location

User: Linus
- It would be nice for there to be a way to group or reorder saved flights on the user page.
- Not as far as organizing them into trips, but a custom order would be nice

User: Ben
- The "compress" box appears before flights populate, it shouldn't appear until there's a need to actually compress the search box
  - Even then, it should go straight to "expand"
- On the saved flights page, the click box is too small to bring up the modal

User: Jake
- Would be nice to have airlines on the cards instead of just the modal
- Inverse sorting (useful depending on the trip)
- Multiple airport selection

User: Artem
- Would be nice for the semantic search to pull up & compute multi leg trips
  - We'd need to think of a different way to display them

User: Emily
- Could be cool to create trips (groups of flights) and share them with other people
  - We'd need a new DB table to track saved groups per user
  - Making them sharable wouldn't be too hard

---
User: Samantha
- Price filtering could be granular (i.e. greater than 5k but less than 9k)
- Would be nice to filter by number of stops (0, 1, 2+)

User: Michael
- Date picker is a little janky, should probably start at tomorrow rather than today
- Not super mobile friendly, but gets the job done
- When start range is updated to be after the end, the end should automatically update to be on that same day

User: Sam
- On mobile, the search page feels too cluttered
- Hard to skim over flights with cards that big, prefers the google flights table view

User: David
- Wants to be able to search from multiple departure/arrival locations

User: Alex
- Wants better semantic search (times, "thanksgiving", holidays)

User: Izzy
- Is there any way to have semantic search do open-jaw flights?
- Like a flight from USA - Germany and then another flight from France - USA (round trip with different middle destinations)

User: Rohan
- Semantic search for flight filtering (like "avoid redeyes" or "leave in the afternoon")

User: Mateo
- Completely spitballing, but it would be really cool for a maintained list of cheap or "value" routes that someone could filter by
- Can we create a "suggested" sort that takes duration + cost + stops into account?
