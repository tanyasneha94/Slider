import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SlickSlider from './SlickSlider';
import * as useFetchPostsModule from './useFetchPosts';

jest.mock('./useFetchPosts');

describe('SlickSlider', () => {
  it('renders loading state initially', () => {
    useFetchPostsModule.default.mockReturnValue({
      posts: [],
      loading: true,
      error: null,
      fetchPosts: jest.fn(),
    });

    render(<SlickSlider />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders error state and retry button', () => {
    useFetchPostsModule.default.mockReturnValue({
      posts: [],
      loading: false,
      error: 'Failed to fetch posts',
      fetchPosts: jest.fn(),
    });

    render(<SlickSlider />);

    expect(screen.getByText(/failed to fetch posts/i)).toBeInTheDocument();
    expect(screen.getByText(/retry/i)).toBeInTheDocument();
  });

  it('renders slider with posts', async () => {
    const mockPosts = [
      { id: 1, title: 'Post 1', body: 'Body of post 1' },
      { id: 2, title: 'Post 2', body: 'Body of post 2' },
    ];

    useFetchPostsModule.default.mockReturnValue({
      posts: mockPosts,
      loading: false,
      error: null,
      fetchPosts: jest.fn(),
    });

    render(<SlickSlider />);

    await waitFor(() => {
      expect(screen.getByText('Post 1')).toBeInTheDocument();
      expect(screen.getByText('Post 2')).toBeInTheDocument();
    });
  });

  it('calls fetchPosts when retry button is clicked', async () => {
    const fetchPostsMock = jest.fn();
    useFetchPostsModule.default.mockReturnValue({
      posts: [],
      loading: false,
      error: 'Failed to fetch posts',
      fetchPosts: fetchPostsMock,
    });

    render(<SlickSlider />);

    fireEvent.click(screen.getByText(/retry/i));
    expect(fetchPostsMock).toHaveBeenCalledTimes(1);
  });
});
