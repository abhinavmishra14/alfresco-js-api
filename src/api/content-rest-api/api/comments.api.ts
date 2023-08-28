/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { CommentBody } from '../model/commentBody';
import { CommentEntry } from '../model/commentEntry';
import { CommentPaging } from '../model/commentPaging';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';
import { buildCollectionParam } from '../../../alfrescoApiClient';

/**
* Comments service.
* @module CommentsApi
*/
export class CommentsApi extends BaseApi {
    /**
    * Create a comment
    *
    * Creates a comment on node **nodeId**. You specify the comment in a JSON body like this:

JSON
{
  \"content\": \"This is a comment\"
}

**Note:** You can create more than one comment by
specifying a list of comments in the JSON body like this:

JSON
[
  {
    \"content\": \"This is a comment\"
  },
  {
    \"content\": \"This is another comment\"
  }
]

If you specify a list as input, then a paginated list rather than an entry is returned in the response body. For example:

JSON
{
  \"list\": {
    \"pagination\": {
      \"count\": 2,
      \"hasMoreItems\": false,
      \"totalItems\": 2,
      \"skipCount\": 0,
      \"maxItems\": 100
    },
    \"entries\": [
      {
        \"entry\": {
          ...
        }
      },
      {
        \"entry\": {
          ...
        }
      }
    ]
  }
}

    *
    * @param nodeId The identifier of a node.
    * @param commentBodyCreate The comment text. Note that you can also provide a list of comments.
    * @param opts Optional parameters
    * @param opts.fields A list of field names.

You can use this parameter to restrict the fields
returned within a response if, for example, you want to save on overall bandwidth.

The list applies to a returned individual
entity or entries within a collection.

If the API method also supports the **include**
parameter, then the fields specified in the **include**
parameter are returned in addition to those specified in the **fields** parameter.

    * @return Promise<CommentEntry>
    */
    createComment(nodeId: string, commentBodyCreate: CommentBody, opts?: { fields?: string[] }): Promise<CommentEntry> {
        throwIfNotDefined(nodeId, 'nodeId');
        throwIfNotDefined(commentBodyCreate, 'commentBodyCreate');

        const pathParams = {
            nodeId
        };

        const queryParams = {
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.post({
            path: '/nodes/{nodeId}/comments',
            pathParams,
            queryParams,
            bodyParam: commentBodyCreate,
            returnType: CommentEntry
        });
    }
/**
    * Delete a comment
    *
    * Deletes the comment **commentId** from node **nodeId**.
    *
    * @param nodeId The identifier of a node.
    * @param commentId The identifier of a comment.
    * @return Promise<{}>
    */
    deleteComment(nodeId: string, commentId: string): Promise<any> {
        throwIfNotDefined(nodeId, 'nodeId');
        throwIfNotDefined(commentId, 'commentId');

        const pathParams = {
            nodeId,
            commentId
        };

        return this.delete({
            path: '/nodes/{nodeId}/comments/{commentId}',
            pathParams
        });
    }
/**
    * List comments
    *
    * Gets a list of comments for the node **nodeId**, sorted chronologically with the newest comment first.
    *
    * @param nodeId The identifier of a node.
    * @param opts Optional parameters
    * @param opts.skipCount The number of entities that exist in the collection before those included in this list.
If not supplied then the default value is 0.
 (default to 0)
    * @param opts.maxItems The maximum number of items to return in the list.
If not supplied then the default value is 100.
 (default to 100)
    * @param opts.fields A list of field names.

You can use this parameter to restrict the fields
returned within a response if, for example, you want to save on overall bandwidth.

The list applies to a returned individual
entity or entries within a collection.

If the API method also supports the **include**
parameter, then the fields specified in the **include**
parameter are returned in addition to those specified in the **fields** parameter.

    * @return Promise<CommentPaging>
    */
    listComments(nodeId: string, opts?: { skipCount?: number; maxItems?: number; fields?: string[] }): Promise<CommentPaging> {
        throwIfNotDefined(nodeId, 'nodeId');

        const pathParams = {
            nodeId
        };

        const queryParams = {
            skipCount: opts?.skipCount,
            maxItems: opts?.maxItems,
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.get({
            path: '/nodes/{nodeId}/comments',
            pathParams,
            queryParams,
            returnType: CommentPaging
        });
    }
/**
    * Update a comment
    *
    * Updates an existing comment **commentId** on node **nodeId**.
    *
    * @param nodeId The identifier of a node.
    * @param commentId The identifier of a comment.
    * @param commentBodyUpdate The JSON representing the comment to be updated.
    * @param opts Optional parameters
    * @param opts.fields A list of field names.

You can use this parameter to restrict the fields
returned within a response if, for example, you want to save on overall bandwidth.

The list applies to a returned individual
entity or entries within a collection.

If the API method also supports the **include**
parameter, then the fields specified in the **include**
parameter are returned in addition to those specified in the **fields** parameter.

    * @return Promise<CommentEntry>
    */
    updateComment(nodeId: string, commentId: string, commentBodyUpdate: CommentBody, opts?: { fields?: string[] }): Promise<CommentEntry> {
        throwIfNotDefined(nodeId, 'nodeId');
        throwIfNotDefined(commentId, 'commentId');
        throwIfNotDefined(commentBodyUpdate, 'commentBodyUpdate');

        const pathParams = {
            nodeId,
            commentId
        };

        const queryParams = {
            fields: buildCollectionParam(opts?.fields, 'csv')
        };

        return this.put({
            path: '/nodes/{nodeId}/comments/{commentId}',
            pathParams,
            queryParams,
            bodyParam: commentBodyUpdate,
            returnType: CommentEntry
        });
    }

}
