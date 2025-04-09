import { Box, Button, Icon, Text } from "@adminjs/design-system";
import { ReduxState } from "adminjs";
import React, { FC } from "react";

const Login = () => {
  const GITHUB_URL = window.AdminJS.env.GITHUB_URL;
  const SLACK_URL = window.AdminJS.env.SLACK_URL;
  const DOCUMENTATION_URL = window.AdminJS.env.DOCUMENTATION_URL;

  return (
    <Box flex flexGrow={1} justifyContent="end" alignItems="center">
      <Text ml="xl" mr="auto">
        1.1.1
      </Text>
      <Button color="text" as="a" href={SLACK_URL} target="_blank">
        <Icon icon="Slack" />
        Slack
      </Button>
      <Button color="text" as="a" href={GITHUB_URL} target="_blank">
        <Icon icon="GitHub" />
        GitHub
      </Button>
      <Button color="text" as="a" href={DOCUMENTATION_URL} target="_blank">
        <Icon icon="BookOpen" />
        Documentation
      </Button>
    </Box>
  );
};

export { Login };
export default Login;
