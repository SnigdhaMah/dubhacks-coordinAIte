import React from 'react';
import Todos from './Todos';
import FeatureGrid from './FeatureGrid';
import { FeatureType } from '../types/featureType';
import { TodoType } from '../types/todoType';

interface MainPageProps {
  // for Todos
  todos: TodoType[];
  onClickTodo: (todo: TodoType) => void;
  updateTodo: (updatedTodo: TodoType) => void;
  // for Feature Grid
  featureIndex: FeatureType[];
  onClickFeature: (feature: FeatureType) => void;
}

export default function MainPage({
  todos,
  onClickTodo,
  updateTodo,
  featureIndex,
  onClickFeature,
}: MainPageProps) {
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <Todos todos={todos} onClickTodo={onClickTodo} updateTodo={updateTodo} />
      <FeatureGrid
        featureIndex={featureIndex}
        onClickFeature={onClickFeature}
      />
    </div>
  );
}
