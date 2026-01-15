import { Button } from "flowbite-react";
import React from "react";

export default function CalltoAction() {
  return (
    <div className="flex flex-col smn:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl">
      <div className="flex-1 justify-center flex flex-col">
        <h2 className="text-2xl text-center">
          Want to learn more about Javascript?
        </h2>
        <p className="text-gray-500 my-2">
          Checkout these resources to learn Javascript and build projects
        </p>
        <Button>
          <a
            href="https://www.geeksforgeeks.org/javascript/javascript-tutorial/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn
          </a>
        </Button>
      </div>
      <div className="p-7 flex-1">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx2t4KccHt4-6e0I2povOhpUvHvHtXxi7N1w&s" />
      </div>
    </div>
  );
}
