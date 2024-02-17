import { SetMetadata } from '@nestjs/common';

export const ADD_ENTRY_POINT_COMMENT = 'ADD_ENTRY_POINT_COMMENT';
/**
 * @description QueryBuilder에 EntryPoint를 추가하는 함수 데코레이터
 */
export const AddEntryPointComment = () => SetMetadata(ADD_ENTRY_POINT_COMMENT, true);
