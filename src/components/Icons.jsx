import React from "react";
export const ChevronDown = ({fill, size, height, width, ...props}) => {
  return (
    <svg
      fill="none"
      height={size || height || 24}
      viewBox="0 0 24 24"
      width={size || width || 24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
    </svg>
  );
};

export const Lock = ({fill, size, height, width, ...props}) => {
  const color = fill;

  return (
    <svg
      height={size || height || 24}
      viewBox="0 0 24 24"
      width={size || width || 24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g transform="translate(3.5 2)">
        <path
          d="M9.121,6.653V4.5A4.561,4.561,0,0,0,0,4.484V6.653"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          strokeWidth={1.5}
          transform="translate(3.85 0.75)"
        />
        <path
          d="M.5,0V2.221"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          strokeWidth={1.5}
          transform="translate(7.91 12.156)"
        />
        <path
          d="M7.66,0C1.915,0,0,1.568,0,6.271s1.915,6.272,7.66,6.272,7.661-1.568,7.661-6.272S13.4,0,7.66,0Z"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          strokeWidth={1.5}
          transform="translate(0.75 6.824)"
        />
      </g>
    </svg>
  );
};

export const Activity = ({fill, size, height, width, ...props}) => {
  return (
    <svg
      height={size || height || 24}
      viewBox="0 0 24 24"
      width={size || width || 24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g
        fill="none"
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      >
        <path d="M6.918 14.854l2.993-3.889 3.414 2.68 2.929-3.78" />
        <path d="M19.668 2.35a1.922 1.922 0 11-1.922 1.922 1.921 1.921 0 011.922-1.922z" />
        <path d="M20.756 9.269a20.809 20.809 0 01.194 3.034c0 6.938-2.312 9.25-9.25 9.25s-9.25-2.312-9.25-9.25 2.313-9.25 9.25-9.25a20.931 20.931 0 012.983.187" />
      </g>
    </svg>
  );
};

export const Flash = ({
  fill = "currentColor",
  size,
  height,
  width,
  ...props
}) => {
  return (
    <svg
      fill="none"
      height={size || height}
      viewBox="0 0 24 24"
      width={size || width}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6.09 13.28h3.09v7.2c0 1.68.91 2.02 2.02.76l7.57-8.6c.93-1.05.54-1.92-.87-1.92h-3.09v-7.2c0-1.68-.91-2.02-2.02-.76l-7.57 8.6c-.92 1.06-.53 1.92.87 1.92Z"
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
    </svg>
  );
};

export const Server = ({
  fill = "currentColor",
  size,
  height,
  width,
  ...props
}) => {
  return (
    <svg
      fill="none"
      height={size || height}
      viewBox="0 0 24 24"
      width={size || width}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M19.32 10H4.69c-1.48 0-2.68-1.21-2.68-2.68V4.69c0-1.48 1.21-2.68 2.68-2.68h14.63C20.8 2.01 22 3.22 22 4.69v2.63C22 8.79 20.79 10 19.32 10ZM19.32 22H4.69c-1.48 0-2.68-1.21-2.68-2.68v-2.63c0-1.48 1.21-2.68 2.68-2.68h14.63c1.48 0 2.68 1.21 2.68 2.68v2.63c0 1.47-1.21 2.68-2.68 2.68ZM6 5v2M10 5v2M6 17v2M10 17v2M14 6h4M14 18h4"
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
};

export const TagUser = ({
  fill = "currentColor",
  size,
  height,
  width,
  ...props
}) => {
  return (
    <svg
      fill="none"
      height={size || height}
      viewBox="0 0 24 24"
      width={size || width}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M18 18.86h-.76c-.8 0-1.56.31-2.12.87l-1.71 1.69c-.78.77-2.05.77-2.83 0l-1.71-1.69c-.56-.56-1.33-.87-2.12-.87H6c-1.66 0-3-1.33-3-2.97V4.98c0-1.64 1.34-2.97 3-2.97h12c1.66 0 3 1.33 3 2.97v10.91c0 1.63-1.34 2.97-3 2.97Z"
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
      <path
        d="M12 10a2.33 2.33 0 1 0 0-4.66A2.33 2.33 0 0 0 12 10ZM16 15.66c0-1.8-1.79-3.26-4-3.26s-4 1.46-4 3.26"
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
};


export const Scale = ({
  fill = "currentColor",
  size,
  height,
  width,
  ...props
}) => {
  return (
    <svg
      fill="none"
      height={size || height}
      viewBox="0 0 24 24"
      width={size || width}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7ZM18 6 6 18"
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M18 10V6h-4M6 14v4h4"
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
};
export const Gaming = ({fill, size, height, width, ...props}) => {
  return (
    <svg
      fill="none"
      height={size || height || 24}
      viewBox="0 0 32 32"
      width={size || width || 24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g>
        <path fill="#4C4842" d="M29,32H3c-1.657,0-3-1.343-3-3V3c0-1.657,1.343-3,3-3h26c1.657,0,3,1.343,3,3v26C32,30.657,30.657,32,29,32z"/>
        <path fill="#67625D" d="M27,32H3c-1.657,0-3-1.343-3-3V3c0-1.657,1.343-3,3-3h24c1.657,0,3,1.343,3,3v26C30,30.657,28.657,32,27,32z"/>
        <path fill="#837F79" d="M12,14h-2v-2c0-0.552-0.448-1-1-1H6c-0.552,0-1,0.448-1,1v2H3c-0.552,0-1,0.448-1,1v2
          c0,0.552,0.448,1,1,1h2v2c0,0.552,0.448,1,1,1h3c0.552,0,1-0.448,1-1v-2h2c0.552,0,1-0.448,1-1v-2C13,14.448,12.552,14,12,14z"/>
        <path fill="#A5A29C" d="M11,14H9v-2c0-0.552-0.448-1-1-1H6c-0.552,0-1,0.448-1,1v2H3c-0.552,0-1,0.448-1,1v2
          c0,0.552,0.448,1,1,1h2v2c0,0.552,0.448,1,1,1h2c0.552,0,1-0.448,1-1v-2h2c0.552,0,1-0.448,1-1v-2C12,14.448,11.552,14,11,14z"/>
        <path fill="#EDB57E" d="M20,11c-0.174,0-0.826,0-1,0c-1.105,0-2,0.895-2,2c0,1.105,0.895,2,2,2c0.174,0,0.826,0,1,0
          c1.105,0,2-0.895,2-2C22,11.895,21.105,11,20,11z"/>
        <circle fill="#F2C99E" cx="19" cy="13" r="2"/>
        <path fill="#65C3AB" d="M26,11c-0.174,0-0.826,0-1,0c-1.105,0-2,0.895-2,2c0,1.105,0.895,2,2,2c0.174,0,0.826,0,1,0
          c1.105,0,2-0.895,2-2C28,11.895,27.105,11,26,11z"/>
        <circle fill="#98D3BC" cx="25" cy="13" r="2"/>
        <path fill="#D97360" d="M26,17c-0.174,0-0.826,0-1,0c-1.105,0-2,0.895-2,2c0,1.105,0.895,2,2,2c0.174,0,0.826,0,1,0
          c1.105,0,2-0.895,2-2C28,17.895,27.105,17,26,17z"/>
        <path fill="#BCD269" d="M20,17c-0.174,0-0.826,0-1,0c-1.105,0-2,0.895-2,2c0,1.105,0.895,2,2,2c0.174,0,0.826,0,1,0
          c1.105,0,2-0.895,2-2C22,17.895,21.105,17,20,17z"/>
        <circle fill="#E69D8A" cx="25" cy="19" r="2"/>
        <circle fill="#D1DE8B" cx="19" cy="19" r="2"/>
      </g>
    </svg>
  );
};