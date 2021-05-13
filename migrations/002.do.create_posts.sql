create table posts (
    id integer primary key generated by default as identity,
    post_name text not null,
    content text not null,
    modified timestamptz default now() not null,
    author text not null
);

alter table posts
    add column
        group_id integer references groups(id) on delete cascade not null;