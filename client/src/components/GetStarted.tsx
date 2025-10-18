import React from 'react';

type GetStartedProps = {
  goToNextPage: () => void;
};
export default function GetStarted({ goToNextPage }: GetStartedProps) {
  return (
    <div>
      Get Started Component
      <button onClick={goToNextPage}>Next</button>
    </div>
  );
}
