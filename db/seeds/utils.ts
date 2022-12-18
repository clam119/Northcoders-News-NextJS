import ConvertTimeStampToDate from '@lib/utilsInterface'
import { Comments, CreateRef, Article, Comment } from '@lib/utilsInterface'

export const convertTimestampToDate = ({ created_at, ...otherProperties }: ConvertTimeStampToDate ) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

export const createRef = (arr: Article[], key: string, value: string) => {
  return arr.reduce((ref: CreateRef, element: Article) => {
    ref[element[key]] = element[value];
    return ref;
  }, {});
};

export const formatComments = (comments: Comment[], idLookup: CreateRef) => {
  return comments.map(({ created_by, belongs_to, ...restOfComment }: any) => {
    const returnedComment: any = {
      ...convertTimestampToDate(restOfComment)
    }
    return returnedComment;
  });
};

