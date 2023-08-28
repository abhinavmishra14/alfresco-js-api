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

import { EcmAuthMock } from '../mockObjects/content-services/ecm-auth.mock';
import {
    AuthorityClearanceGroupPaging,
    NodeSecurityMarkBody, SecurityMarkEntry, SecurityMarkPaging
} from '../../src/api/gs-classification-rest-api/model/index';
import { AuthorityClearanceApi } from '../../src/api/gs-classification-rest-api/api/index';
import { AuthorityClearanceMock } from '../mockObjects/goverance-services/authority-clearance.mock';
import { AlfrescoApi } from '../../src/alfrescoApi';
import { expect } from 'chai';

const DEFAULT_OPTS = {
    skipCount: 0,
    maxItems: 100
}

describe('Authority Clearance API test', () => {
    let authResponseMock: EcmAuthMock;
    let authorityClearanceMock: AuthorityClearanceMock;
    let authorityClearanceApi: AuthorityClearanceApi;
    const nodeSecurityMarkBodyList: Array<NodeSecurityMarkBody> = [
        {
            groupId: 'securityGroupFruits',
            op: 'ADD',
            id: 'fruitMarkId1',
        },
        {
            groupId: 'securityGroupFruits',
            op: 'ADD',
            id: 'fruitMarkId1',
        }
    ];
    const nodeSecurityMarkBodySingle: Array<NodeSecurityMarkBody> = [
        {
            groupId: 'securityGroupFruits',
            op: 'ADD',
            id: 'fruitMarkId1'
        }
    ]

    beforeEach(async () => {
        const hostEcm = 'http://127.0.0.1:8080';
        authResponseMock = new EcmAuthMock(hostEcm);
        authResponseMock.get201Response();
        authorityClearanceMock = new AuthorityClearanceMock(hostEcm);
        const alfrescoApi = new AlfrescoApi({
            hostEcm: hostEcm,
        });
        authorityClearanceApi = new AuthorityClearanceApi(alfrescoApi);
        await alfrescoApi.login('admin', 'admin');
    });

    it('get authority clearances for an authority', async () => {
        const nodeId = 'testAuthorityId';
        authorityClearanceMock.get200AuthorityClearanceForAuthority(nodeId);
        await authorityClearanceApi.getAuthorityClearanceForAuthority(nodeId, DEFAULT_OPTS).then((response: AuthorityClearanceGroupPaging) => {
            expect(response.list.entries[0].entry.id).equal('securityGroupFruits');
            expect(response.list.entries[0].entry.displayLabel).equal('Security Group FRUITS');
            expect(response.list.entries[0].entry.type).equal('USER_REQUIRES_ALL');
            expect(response.list.entries[0].entry.marks.length).equal(3);
        });
    });

    it('add single security marks to an authority', async () => {
        const nodeId = 'testAuthorityId';
        authorityClearanceMock.post200AuthorityClearanceWithSingleItem(nodeId);
        await authorityClearanceApi.updateAuthorityClearance(nodeId, nodeSecurityMarkBodySingle).then((data: SecurityMarkEntry | SecurityMarkPaging) => {
            const response = data as SecurityMarkEntry;
            expect(response.entry.id).equal('fruitMarkId1');
            expect(response.entry.name).equal('APPLES');
            expect(response.entry.groupId).equal('securityGroupFruits');
        });
    });

    it('add multiple security marks on an authority', async () => {
        const nodeId = 'testAuthorityId';
        authorityClearanceMock.post200AuthorityClearanceWithList(nodeId);
        await authorityClearanceApi.updateAuthorityClearance(nodeId, nodeSecurityMarkBodyList).then((data: SecurityMarkEntry | SecurityMarkPaging) => {
            const response: SecurityMarkPaging = data as SecurityMarkPaging;
            expect(response.list.entries[0].entry.id).equal('fruitMarkId1');
            expect(response.list.entries[0].entry.name).equal('APPLES');
            expect(response.list.entries[0].entry.groupId).equal('securityGroupFruits');
        });
    });
});
