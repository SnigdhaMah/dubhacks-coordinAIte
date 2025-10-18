import React from 'react';
import Todos from './Todos';
import FeatureGrid from './FeatureGrid';
import { FeatureType } from '../types/featureType';
import { TodoType } from '../types/todoType';

interface MainPageProps {
  // for Todos
  todos: TodoType[];
  onClickTodo: (todo: string) => void;
  // for Feature Grid
  featureIndex: FeatureType[];
  onClickFeature: (feature: FeatureType) => void;
}

export default function MainPage({ todos, onClickTodo, featureIndex, onClickFeature }: MainPageProps) {
  return (
    <div>
      Main Page Component
      <Todos todos={todos} onClickTodo={onClickTodo} />
      <FeatureGrid featureIndex={featureIndex} onClickFeature={onClickFeature}/>
      </div>
  )
}
