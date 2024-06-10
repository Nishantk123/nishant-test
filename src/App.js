import React, { useMemo, useState, useCallback } from 'react';
import ReactFamilyTree from 'react-family-tree';
import { SourceSelect } from './component/SourceSelect';
import { PinchZoomPan } from './PinchZoomPan/PinchZoomPan';
import { FamilyNode } from './FamilyNode/FamilyNode';
// import { NodeDetails } from '../NodeDetails/NodeDetails';
import { NODE_WIDTH, NODE_HEIGHT, SOURCES, DEFAULT_SOURCE } from './const';
import { getNodeStyle } from './utils';

import css from './App.module.css';


export default React.memo(
  function App() {
    const [source, setSource] = useState(DEFAULT_SOURCE);
    const [nodes, setNodes] = useState(SOURCES[source]);

    const firstNodeId = useMemo(() => nodes[0].id, [nodes]);
    const [rootId, setRootId] = useState(firstNodeId);

    const [selectId, setSelectId] = useState();
    const [hoverId, setHoverId] = useState();

    const resetRootHandler = useCallback(() => setRootId(firstNodeId), [firstNodeId]);

    const changeSourceHandler = useCallback(
      (value, nodes) => {
        setRootId(nodes[0].id);
        setNodes(nodes);
        setSource(value);
        setSelectId(undefined);
        setHoverId(undefined);
      },
      [],
    );

    const selected = useMemo(() => (
      nodes.find(item => item.id === selectId)
    ), [nodes, selectId]);

    return (
      <div className={css.root}>
        <header className={css.header}>

          <div>
            <label>Source: </label>
            <SourceSelect value={source} items={SOURCES} onChange={changeSourceHandler} />
          </div>

        </header>
        {nodes.length > 0 && (
          <PinchZoomPan min={0.5} max={2.5} captureWheel className={css.wrapper}>
            <ReactFamilyTree
              nodes={nodes}
              rootId={rootId}
              width={NODE_WIDTH}
              height={NODE_HEIGHT}
              className={css.tree}
              renderNode={(node) => (
                <FamilyNode
                  key={node.id}
                  node={node}
                  isRoot={node.id === rootId}
                  isHover={node.id === hoverId}
                  onClick={setSelectId}
                  onSubClick={setRootId}
                  style={getNodeStyle(node)}
                />
              )}
            />
           </PinchZoomPan>
        )}
        {/* {rootId !== firstNodeId && (
          <button className={css.reset} onClick={resetRootHandler}>
            Reset
          </button>
        )}
        {selected && (
          <NodeDetails
            node={selected}
            className={css.details}
            onSelect={setSelectId}
            onHover={setHoverId}
            onClear={() => setHoverId(undefined)}
          />
        )} */}
      </div>
    );
  },
);
