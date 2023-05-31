import { Switch } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";

const ToggleThemeMode = () => {
  const [isToggled, setIsToggled] = useState(false);

  useEffect(() => {
    function toggle() {
      isToggled
        ? document.documentElement.setAttribute("data-theme", "light")
        : document.documentElement.setAttribute("data-theme", "dark");
    }
    toggle();
  }, [isToggled]);
  return (
    <form className="toggle-theme">
      <Switch
        size="lg"
        value={isToggled}
        onChange={(e) => {
          setIsToggled(e.target.checked);
        }}
      />
    </form>
  );
};

export default ToggleThemeMode;
