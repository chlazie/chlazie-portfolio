import React, { useState } from "react";

// icons
import {
  FaHtml5,
  FaCss3,
  FaJs,
  FaReact,
  FaWordpress,
  FaFigma,
  FaNodeJs,
  FaPhp,
  FaPython,
} from "react-icons/fa";

import {
  SiNextdotjs,
  SiFramer,
  SiCanva,
  SiAdobephotoshop,
} from "react-icons/si";

//  data
const aboutData = [
  {
    title: "skills",
    info: [
      {
        title: "Web Development",
        icons: [
          <FaHtml5 />,
          <FaCss3 />,
          <FaJs />,
          <FaReact />,
          <SiNextdotjs />,
          <SiFramer />,
          <FaWordpress />,
          <FaNodeJs />,
          <FaPhp />,
          <FaPython />,
        ],
      },
      {
        title: "UI/UX Design",
        icons: [<FaFigma />, <SiCanva />, <SiAdobephotoshop />],
      },
    ],
  },
  {
    title: "awards",
    info: [
      {
        title: "Webby Awards - Honoree",
        stage: "2024 - 2025",
      },
      {
        title: "Adobe Design Achievement Awards - Finalist",
        stage: "2024 - 2025",
      },
    ],
  },
  {
    title: "experience",
    info: [
      {
        title: "Trainee - Gallant Designs",
        stage: "2023 - 2024",
      },
      {
        title: "Web Developer - Innovation Growth Hub",
        stage: "2025 - Till Date",
      },
      {
        title: "Intern - Amazon",
        stage: "2024 - 2025",
      },
    ],
  },
  {
    title: "credentials",
    info: [
      {
        title: "Web Development - Innovation Growth Hub",
        stage: "2021",
      },
      {
        title: "Computer Science Diploma - Havard University",
        stage: "2029",
      },
      {
        title: "Certified Graphic Designer - Gallant Designs",
        stage: "2023",
      },
    ],
  },
];

// components
import Avatar from "../../components/Avatar";
import Circles from "../../components/Circles";

const About = () => {
  const [index, setIndex] = useState(0);

  return (
    <div>
      <Circles />
    </div>
  );
};

export default About;
