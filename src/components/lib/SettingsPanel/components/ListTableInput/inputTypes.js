
const variants = [
  "body1",
  "body2",
  "button",
  "caption",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "inherit",
  "overline",
  "subtitle1",
  "subtitle2"
];


export const inputTypes = {
  Text: [
    {
      label: 'Variant',
      types: variants
    }
  ],
  Image: [
    {
      label: 'Width',
      xs: 4
    },
    {
      label: 'Height',
      xs: 4
    },
    {
      label: 'Radius',
      xs: 4
    },
    {
      title: 'Default Image',
      label: 'default_image' 
    },
  ],
  Icon: [
    {
      label: 'Size',
      types: [
        "small",
        "medium",
        "large"
      ],
    },
  ],
  Link: [
    {
      label: 'Variant',
      types: variants,
      xs: 6
    },
    { 
      label: "underline",
      xs: 6,
      types: [
        "always",
        "hover",
        "none"
      ], 
    }
  ]
}
