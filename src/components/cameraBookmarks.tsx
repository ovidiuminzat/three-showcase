import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type CameraBookmark = {
  azimuthalAngle: number;
  polarAngle: number;
};

interface CameraBookmarksProps {
  bookmarks: CameraBookmark[];
  onLoadClick: (bookmark: CameraBookmark) => void;
}

export const CameraBookmarks: React.FC<CameraBookmarksProps> = ({
  bookmarks,
  onLoadClick,
}) => {
  const [selectValue, setSelectValue] = useState("");
  return (
    <>
      <Label>Bookmarked Camera Positions</Label>
      <Select
        value={selectValue}
        onValueChange={(value) => {
          setSelectValue(value);
          onLoadClick(bookmarks[parseInt(value)]);
          setSelectValue("");
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a Bookmark" />
        </SelectTrigger>
        <SelectContent>
          {bookmarks.length === 0 && (
            <SelectItem disabled value="0">
              No bookmarks saved
            </SelectItem>
          )}
          {bookmarks.map((bookmark, index) => (
            <SelectItem
              key={`bookmark-${index}`}
              onClick={() => onLoadClick(bookmark)}
              value={`${index}`}
            >{`Bookmark-${index}`}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};
