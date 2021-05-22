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
      id: 1,
      post_name: 'Post one',
      content: 'Content for post one',
      modified: '2021-05-20 23:21:26.392487+00',
      author: 'Author one',
      group_id: '1'
    },
    {
      id: 2,
      post_name: 'Post two',
      content: 'Content for post two',
      modified: '2021-05-20 23:21:26.392487+00',
      author: 'Author two',
      group_id: '2'
    },
    {
      id: 3,
      post_name: 'Post three',
      content: 'Content for post three',
      modified: '2021-05-20 23:21:26.392487+00',
      author: 'Author three',
      group_id: '3'
    }
  ];
}

module.exports = {
  makeGroupsArray,
  makePostsArray
};
