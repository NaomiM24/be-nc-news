exports.formatDates = list => {
  const convertedDate = [];
  list.forEach((item, i) => {
    const obj = {...item}
    convertedDate.push(obj)
    convertedDate[i].created_at = new Date(convertedDate[i].created_at)
  })
  //console.log(convertedDate)
  return convertedDate
};

exports.makeRefObj = list => {
  const refObj = {};
  list.forEach(item => {
    refObj[item.title] = item.article_id;
  });
  return refObj;
};

exports.formatComments = (comments, articleRef) => {
  //console.log(comments)
  const formattedComments = [];
  comments.forEach((item, i) => {
    const comment = {...item}
    formattedComments.push(comment)
    formattedComments[i].author = comment.created_by;
    formattedComments[i].article_id = articleRef[comment.belongs_to]
    formattedComments[i].created_at = new Date(formattedComments[i].created_at)
    delete formattedComments[i].created_by
    delete formattedComments[i].belongs_to
  })
  //console.log(formattedComments)
  return formattedComments
};

/*## formatComments

This utility function should be able to take an array of comment objects (`comments`) and a reference object, and return a new array of formatted comments.

Each formatted comment must have:

- Its `created_by` property renamed to an `author` key
- Its `belongs_to` property renamed to an `article_id` key
- The value of the new `article_id` key must be the id corresponding to the original title value provided
- Its `created_at` value converted into a javascript date object
- The rest of the comment's properties must be maintained */
