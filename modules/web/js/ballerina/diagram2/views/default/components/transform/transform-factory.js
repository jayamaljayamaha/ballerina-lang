/**
 * Copyright (c) 2017, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import log from 'log';
import NodeFactory from '../../../../../model/node-factory';
import FragmentUtils from '../../../../../utils/fragment-utils';
import TreeBuilder from '../../../../../model/tree-builder';

class TransformFactory {
    
    static createSimpleVariableRef(variableName) {
        const variableRef = NodeFactory.createSimpleVariableRef({});
        const identifierNode = NodeFactory.createIdentifier({});
        identifierNode.setValue(variableName);
        variableRef.setVariableName(identifierNode);
        return variableRef;
    }

    static createVariableDef(name, type, value) {
        const variableDef = NodeFactory.createVariableDef({});
        const variable = NodeFactory.createVariable({});
        const initialExpression = NodeFactory.createLiteral({});
        initialExpression.setValue(value);
        variable.setInitialExpression(initialExpression);
        const typeNode = NodeFactory.createValueType({});
        typeNode.setTypeKind(type);
        const identifierNode = NodeFactory.createIdentifier({});
        identifierNode.setValue(name);
        variable.setName(identifierNode);
        variable.setTypeNode(typeNode);
        variableDef.setVariable(variable);

        // TODO: replace with fragment parser

        // variableDef.setStatementFromString('string ' + varName + ' = ""');
        return variableDef;
    }

    /**
     * Create  for FieldBasedVarRefExpression struct fields
     * @param  {string} name expression name
     * @return {object} FieldBasedVarRefExpression object
     */
    static createFieldBasedVarRefExpression(name) {
        const fragment = FragmentUtils.createExpressionFragment(name);
        const parsedJson = FragmentUtils.parseFragment(fragment);
        const refExpr = TreeBuilder.build(parsedJson.variable.initialExpression);
        return refExpr;
    }

    /**
     * Create assignment statement from given args
     * @static
     * @param {any} args arguments
     * @param {Expression} args.expression expression for the assignment
     * @memberof TransformFactory
     */
    static createAssignmentStatement(args) {
        const assignment = NodeFactory.createAssignment({});
        assignment.setExpression(args.expression);
        return assignment;
    }

    /**
     * Create default expression based on argument type
     * @static
     * @param {any} type type
     * @memberof TransformFactory
     */
    static createDefaultExpression(type) {
        // TODO : get default values from environment and support other types
        let fragment = FragmentUtils.createExpressionFragment('""');
        if (type === 'string') {
            fragment = FragmentUtils.createExpressionFragment('""');
        } else if (type === 'int') {
            fragment = FragmentUtils.createExpressionFragment('0');
        }
        const parsedJson = FragmentUtils.parseFragment(fragment);
        const exp = TreeBuilder.build(parsedJson.variable.initialExpression);
        return exp;
        // TODO : create default expression based on argument type
    }

}

export default TransformFactory;
