import * as Icons from 'lucide-react';
import React from 'react';

// Enhanced icon utility with error handling and default props
export default function getIcon(iconName) {
  // Check if the requested icon exists, fallback to Smile icon if not
  const IconComponent = Icons[iconName] || Icons.HelpCircle;
  
  // Return a function that renders the icon with any props passed to it
  return (props) => {
    try {
      // Merge default props with passed props
      const mergedProps = {
        strokeWidth: 2,
        ...props
      };
      return React.createElement(IconComponent, mergedProps);
    } catch (error) {
      console.error(`Error rendering icon ${iconName}:`, error);
      return React.createElement(Icons.HelpCircle, props);
    }
  };
};