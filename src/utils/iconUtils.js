import * as Icons from 'lucide-react';
import React from 'react';

export default function getIcon(iconName) {
  const IconComponent = Icons[iconName] || Icons.Smile;
  return (props) => {
    // Using React.createElement instead of JSX to avoid syntax errors
    return React.createElement(IconComponent, props);
  };
};