import React, { ChangeEvent } from "react";
// @ts-ignore
import start from '../startButton.svg';

export default function AddButton ({
                                     onImageAdd,
                                     loading = false
                                   }: {
  onImageAdd: (event: ChangeEvent<HTMLInputElement>) => void;
  loading: boolean
}): JSX.Element {

  return (
    <div className="add-button-wrapper">
      <label className="add-button-label" htmlFor="customFileAdd">
        <input
          type="file"
          onChange={onImageAdd}
          className="file-input"
          id="customFileAdd"
          accept=".png, .jpg, .jpeg"
        />
        <img src={start} alt="" className={`add-button-image ${loading ? 'rotate' : ''}`}/>
      </label>
    </div>
  )
}