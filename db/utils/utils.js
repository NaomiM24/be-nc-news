exports.formatDates = list => {
  const convertedDate = [];
  list.forEach((item, i) => {
    const obj = {...item}
    convertedDate.push(obj)
    convertedDate[i].created_at = new Date(convertedDate[i].created_at)
  })
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
  return formattedComments
};
