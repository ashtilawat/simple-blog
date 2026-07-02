import React from 'react';
import { Box, Heading, Button, useMediaQuery, ButtonGroup } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import AuthenticationButton from './AuthenticationButton';

const NavLinks = ({ compact = false }) => {
  const location = useLocation();

  const isArticlesActive = location.pathname.startsWith('/content');
  const isJobsActive = location.pathname.startsWith('/jobs');

  const articlesVariant = isArticlesActive ? 'solid' : 'ghost';
  const jobsVariant = isJobsActive ? 'solid' : 'ghost';

  if (compact) {
    return (
      <ButtonGroup spacing={2}>
        <Button as={RouterLink} to="/content" fontFamily="Space Mono" variant={articlesVariant} size="sm">
          Articles
        </Button>
        <Button as={RouterLink} to="/jobs" fontFamily="Space Mono" variant={jobsVariant} size="sm">
          Jobs
        </Button>
      </ButtonGroup>
    );
  }

  return (
    <ButtonGroup spacing={3}>
      <Button as={RouterLink} to="/content" fontFamily="Space Mono" variant={articlesVariant}>
        Articles
      </Button>
      <Button as={RouterLink} to="/jobs" fontFamily="Space Mono" variant={jobsVariant}>
        Jobs
      </Button>
      <Button fontFamily="Space Mono">Post a Job</Button>
    </ButtonGroup>
  );
};

export const Header = () => {
  const [isLargerThan1300, isLargerThan900] = useMediaQuery([
    '(min-width: 1300px)',
    '(min-width: 900px)'
  ]);

  if (isLargerThan1300) {
    return (
      <Box className="header">
        <Heading as="h1" fontFamily="Space Mono" width="75%">
          <Button as={RouterLink} to="/content" variant="link" fontFamily="Space Mono" fontSize="2xl">
            BOOTCAMP1ST
          </Button>
        </Heading>
        <Box className="quicklinks">
          <NavLinks />
          <AuthenticationButton />
        </Box>
      </Box>
    );
  }

  if (isLargerThan900) {
    return (
      <Box className="headerSM">
        <Heading as="h1" fontFamily="Space Mono" width="40%">
          <Button as={RouterLink} to="/content" variant="link" fontFamily="Space Mono" fontSize="xl">
            BOOTCAMP1ST
          </Button>
        </Heading>
        <Box className="quicklinksSM">
          <ButtonGroup spacing={4}>
            <NavLinks />
            <AuthenticationButton />
          </ButtonGroup>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="headerXS">
      <Heading as="h1" fontFamily="Space Mono" width="50%">
        <Button as={RouterLink} to="/content" variant="link" fontFamily="Space Mono" fontSize="lg">
          BOOTCAMP1ST
        </Button>
      </Heading>
      <Box display="flex" flexDirection="column" alignItems="flex-end" gap={2}>
        <NavLinks compact />
        <AuthenticationButton />
      </Box>
    </Box>
  );
};
