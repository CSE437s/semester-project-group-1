import React, { useState } from "react";
import FlightCardMobile from "./FlightCardMobile";
import { FlightResponseData } from "@/lib/route-types";

// TODO
// These cards are flight cards and should be pulled from the flights that the user searches for
const CardList = [
  {
    id: 1,
    title: "Card 1",
    description: "Description of card 1",
  },
  {
    id: 2,
    title: "Card 2",
    description: "Description of card 2",
  },
  {
    id: 3,
    title: "Card 3",
    description: "Description of card 3",
  },
];

// cards added to board should be removed from card list.
// don't need to keep trakc of cards added, but if you press x they should be removed from saved

type Props = {
  data: FlightResponseData;
};

function FlightStoreMobile(props: any) {
  const [board, setBoard] = useState<any[] | []>([]);

  const handleRemove = (id: any) => {
    console.log("here");
    console.log(id);

    setBoard(board.filter((card) => card.id !== id));
    // TODO
    // remove card from your saved list in db
  };

  const addCardToBoard = (id: any) => {
    const cardList: any = CardList.filter((card: any) => id === card.id);
    setBoard((board) => [...board, cardList[0]]);
    // TODO
    // add card to your saved list in db
  };

  return (
    <div className="flex flex-col mb-10">
      <div className="text-center text-lg my-3 font-bold text-[#ee6c4d]">
        Flight Results
      </div>
      <div className="flex  items-center justify-center flex-col">
        {CardList.map((card) => {
          console.log(props.data.data);
          return (
            <FlightCardMobile
              description={card.description}
              title={card.title}
              id={card.id}
              addCardToBoard={addCardToBoard}
              handleRemove={handleRemove}
              x={false}
            />
          );
        })}
      </div>
      <div className="text-center text-lg my-3 font-bold text-[#ee6c4d]">
        Tap flights above to save them
      </div>
      <div className="flex flex-row justify-center">
        <div className="w-[80vw] no-scrollbar rounded-xl p-8 border-2 border-solid border-slate-400 flex flex-col flex-nowrap overflow-y-scroll   overflow-x-hidden h-auto justify-center bg-[#fafafa]">
          {board.map((card) => {
            return (
              <FlightCardMobile
                description={card.description}
                title={card.title}
                id={card.id}
                x={true}
                addCardToBoard={addCardToBoard}
                handleRemove={handleRemove}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default FlightStoreMobile;
