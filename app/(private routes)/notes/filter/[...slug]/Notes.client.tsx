'use client'

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import Link from 'next/link';

import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import { fetchNotes, type NoteResponse } from '@/lib/api/clientApi';
import css from './notesPage.module.css';

type NoteListClientProps = {
  tag?: string;
};

const NoteListClient = ({ tag }: NoteListClientProps) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [page, setPage] = useState(1);

  const debouncedSetQuery = useDebouncedCallback((value: string) => {
    setDebouncedQuery(value);
  }, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setPage(1);
    debouncedSetQuery(e.target.value);
  };

  const { data } = useQuery<NoteResponse>({
    queryKey: ['notes', { query: debouncedQuery, page, tag }],
    queryFn: () => fetchNotes(page, debouncedQuery, tag),
    refetchOnMount: false,
  });

  const totalPages = data?.totalPages ?? 0;
  const notes = data?.notes ?? [];

  return (
    <>
      <header className={css.toolbar}>
        <SearchBox searchQuery={query} onUpdate={handleInputChange} />
        {totalPages > 1 && (
          <Pagination totalPages={totalPages} page={page} setPage={setPage} />
        )}
        <Link href="/notes/action/create" className={css.button}>
          Create NOTE +
        </Link>
      </header>

      {notes.length > 0 && <NoteList notes={notes} />}
    </>
  );
};

export default NoteListClient;
