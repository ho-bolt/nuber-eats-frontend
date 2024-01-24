import React from "react";
type PageProps = {
  totalPages: number | undefined | null;
  pages: number;
  onNextPage: React.MouseEventHandler;
  onPrevPage: React.MouseEventHandler;
};

export default function Page({
  totalPages,
  onNextPage,
  onPrevPage,
  pages,
}: PageProps) {
  return (
    <div className="grid grid-cols-3 text-center max-w-md mx-auto items-center mt-10">
      {pages > 1 ? (
        <button
          className="focus:outline font-medium text-xl"
          onClick={onPrevPage}
        >
          &larr;
        </button>
      ) : (
        <div></div>
      )}
      <span>
        Page {pages} of {totalPages}
      </span>
      {pages !== totalPages ? (
        <button
          className="focus:outline font-medium text-xl"
          onClick={onNextPage}
        >
          &rarr;
        </button>
      ) : (
        <div></div>
      )}
    </div>
  );
}
