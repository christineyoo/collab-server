function makeGroupsArray() {
  return [
    {
      id: 1,
      group_name: 'Group A'
    },
    {
      id: 2,
      group_name: 'Group B'
    },
    {
      id: 3,
      group_name: 'Group C'
    }
  ];
}

function makePostsArray() {
  return [
    {
      author: 'Author one',
      content: 'Content for post one',
      group_id: 1,
      id: 1,
      modified: '2021-05-20T00:00:00.000Z',
      post_name: 'Post one'
    },
    {
      author: 'Author two',
      content: 'Content for post two',
      group_id: 2,
      id: 2,
      modified: '2021-05-20T00:00:00.000Z',
      post_name: 'Post two'
    },
    {
      author: 'Author three',
      content: 'Content for post three',
      group_id: 3,
      id: 3,
      modified: '2021-05-20T00:00:00.000Z',
      post_name: 'Post three'
    }
  ];
}

function makeCommentsArray() {
  return [
    {
      author: 'Author 1',
      content: 'Content for comment 1',
      id: 1,
      modified: '2021-05-20T00:00:00.000Z',
      post_id: 1
    },
    {
      author: 'Author 2',
      content: 'Content for comment 2',
      id: 2,
      modified: '2021-05-20T00:00:00.000Z',
      post_id: 2
    },
    {
      author: 'Author 3',
      content: 'Content for comment 3',
      id: 3,
      modified: '2021-05-20T00:00:00.000Z',
      post_id: 3
    }
  ];
}

module.exports = {
  makeGroupsArray,
  makePostsArray,
  makeCommentsArray
};
