import React from 'react';
import { Box, Divider } from '@chakra-ui/react';
import { JobPost } from './JobPost';
import { Search } from './Search';
import { DynamicContentList } from './DynamicContentList';

const listings = [
  {
    company: 'Meta',
    title: 'Frontend Engineer',
    source: 'https://cdn.worldvectorlogo.com/logos/meta-1.svg',
    salary: '$90k-$120k',
    location: 'Los Angeles, CA',
    tags: ['JavaScript', 'React', 'Node']
  },
  {
    company: 'Airbnb',
    title: 'Developer Advocate',
    source: 'https://cdn.worldvectorlogo.com/logos/airbnb-1.svg',
    salary: '$80k-$100k',
    location: 'San Francisco, CA',
    tags: ['JavaScript', 'React', 'Node']
  },
  {
    company: 'Notion',
    title: 'Backend Engineer',
    source: 'https://cdn.worldvectorlogo.com/logos/notion-logo-1.svg',
    salary: '$120k-$150k',
    location: 'New York City, NY',
    tags: ['JavaScript', 'React', 'Node']
  },
  {
    company: 'Meta',
    title: 'Frontend Engineer',
    source: 'https://cdn.worldvectorlogo.com/logos/meta-1.svg',
    salary: '$90k-$120k',
    location: 'Los Angeles, CA',
    tags: ['JavaScript', 'React', 'Node']
  }
];

export const Content = () => {
  return (
    <Box className="content">
      <Divider />
      <DynamicContentList />
      <Search />
      {listings.map((job) => (
        <JobPost
          key={job.company + job.title}
          title={job.title}
          company={job.company}
          source={job.source}
          salary={job.salary}
          location={job.location}
          tags={job.tags}
        />
      ))}
    </Box>
  );
};
