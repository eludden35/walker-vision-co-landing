export const menus = [
  {
    id: "home",
    label: "Home",
    href: "/",
  },
  {
    id: "pages",
    label: "Pages",
    children: [
      { label: "About Us", href: "/about-us/" },
      {
        id: "services",
        label: "Services",
        children: [
          { label: "Services", href: "/services/" },
          { label: "Service Details", href: "/services/details/" },
        ],
      },
      {
        id: "team",
        label: "Team",
        children: [
          { label: "Team", href: "/team/" },
          { label: "Team Details", href: "/team/details/" },
        ],
      },
      {
        id: "careers",
        label: "Careers",
        children: [
          { label: "Careers", href: "/careers/" },
          { label: "Career Details", href: "/careers/details/" },
        ],
      },
      { label: "Awards", href: "/awards/" },
      { label: "Location", href: "/location/" },
      { label: "Pricing Plan", href: "/pricing-plan/" },
      { label: "Testimonials", href: "/testimonials/" },
      { label: "FAQ", href: "/faq/" },
      { label: "Terms & Conditions", href: "/terms-conditions/" },
      { label: "Privacy Policy", href: "/privacy-policy/" },
    ],
  },
  {
    id: "properties",
    label: "Properties",
    children: [
      { label: "Properties", href: "/properties/" },
      { label: "Property Details", href: "/properties/details/" },
    ],
  },
  {
    id: "projects",
    label: "Projects",
    children: [
      { label: "Projects", href: "/projects/" },
      { label: "Project Details", href: "/projects/details/" },
    ],
  },
  {
    id: "blog",
    label: "Blog",
    children: [
      { label: "Blog Grid", href: "/blogs/" },
      { label: "Blog Left Sidebar", href: "/blogs/left-sidebar/" },
      { label: "Blog Right Sidebar", href: "/blogs/right-sidebar/" },
      { label: "Blog Details", href: "/blogs/details/" },
      {
        id: "others",
        label: "Others",
        children: [
          { label: "Author", href: "/blogs/author/" },
          { label: "Categorys", href: "/blogs/categorys/" },
          { label: "Tags", href: "/blogs/tags/" },
        ],
      },
    ],
  },
  { id: "contact", label: "Contact Us", href: "/contact-us/" },
];

