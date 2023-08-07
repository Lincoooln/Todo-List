import React, { useState, useEffect } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Card, Button, Col, Row, List, Input, Modal, message, Divider, Form } from 'antd';
import { v4 as uuidv4 } from 'uuid';
const { Item } = Form;

function TodoList() {

  const initialTasks = [
      {
        id: uuidv4(),
        name: "第一天的任务",
        status: "todo",
        details: "熟悉zent组件",
        updatedAt: Date.now(),
      },
      {
        id: uuidv4(),
        name: "第二天的任务",
        status: "todo",
        details: "开发一个TODO LIST",
        updatedAt: Date.now(),
      },
      {
        id: uuidv4(),
        name: "第三天的任务",
        status: "todo",
        details: "熟悉Node和Dubbo的调用",
        updatedAt: Date.now(),
      },

    ];
  const [tasks, setTasks] = useState(initialTasks);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [todoTasks, setTodoTasks] = useState(initialTasks);
  const [doingTasks, setDoingTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');

  const showModal = () => {
      setIsModalVisible(true);
  };

  const handleOk = () => {
    const newTask = { id: uuidv4(), name: taskName, status: 'todo', details: taskDescription, updatedAt: Date.now() };
    setTasks([...tasks, newTask]);
    setTodoTasks([...todoTasks, newTask]);
    setTaskName('');
    setTaskDescription('');
    setIsModalVisible(false);
    message.success('保存成功');
  };

  const handleCancel = () => {
     setIsModalVisible(false);
   };

  const handleStart = (task) => {
    const updatedTasks = tasks.map((t) => {
      if (t.id === task.id) {
        return { ...t, status: "doing", updatedAt: Date.now() };
      }
      return t;
    });
    setTasks(updatedTasks);
    setTodoTasks(todoTasks.filter(t => t.id !== task.id));
    setDoingTasks([...doingTasks, { ...task, status: "doing", updatedAt: Date.now() }]);
  };

  const handleComplete = (task) => {
    const updatedTasks = tasks.map((t) => {
      if (t.id === task.id) {
        return { ...t, status: "done", updatedAt: Date.now() };
      }
      return t;
    });
    setTasks(updatedTasks);
    setDoingTasks(doingTasks.filter(t => t.id !== task.id));
    setDoneTasks([...doneTasks, { ...task, status: "done", updatedAt: Date.now() }]);
  };

  const handleDetails = (task) => {
    alert(task.details);
  };

  // Rotate tasks every 2 seconds
  useEffect(() => {
    console.log(tasks); // this line
    const interval = setInterval(() => {
      setCurrentTaskIndex((prevIndex) => (prevIndex + 1) % tasks.length);
    }, 2000);
    return () => clearInterval(interval); // Cleanup when the component is unmounted
  }, [tasks]);

  return (
    <div style={{ padding: '20px' }}>
          {/* ... Card and rotating tasks... */}
          <Card style={{ backgroundColor: '#BFDFFF'}}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                                <h3>
                                    <InfoCircleOutlined style={{ color: 'blue', marginRight: '10px' }} />
                                    {tasks[currentTaskIndex].name}
                                </h3>
                            <p style={{ color: 'grey', fontSize: '0.8em' }}>{tasks[currentTaskIndex].details}</p>
                        </div>
                        <Button style={{ backgroundColor: 'blue', color: 'white' }} onClick={() => alert(tasks[currentTaskIndex].details)}>
                            查看详情
                        </Button>
            </div>

          </Card>
          {/* Four Columns structure */}
          <Row gutter={16} style={{ marginTop: '20px' }}>
            {/* All Tasks Column */}
            <Col span={6}>
                <Card
                    title={
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ textAlign: 'left' }}>所有任务</div>
                            <Button style={{ backgroundColor: 'blue', color: 'white' }} onClick={showModal}>新建任务</Button>
                        </div>
                    }
                >
                    <List
                        itemLayout="horizontal"
                        dataSource={tasks.sort((a, b) => a.updatedAt - b.updatedAt)}
                        locale={{ emptyText: '暂无任务' }}
                        renderItem={item => (

                            <List.Item>
                            <Card bordered style={{ width: '100%' }}>

                                <List.Item.Meta
                                    style={{ textAlign: 'left' }}
                                    title={<div>{item.name}</div>}
                                    description={<><Divider /><p>{item.details}</p></>}
                                />
                                {item.status === 'todo' && (
                                    <Button style={{ color: '#FFBF80' }} onClick={() => handleStart(item)}>
                                        点击开始
                                    </Button>
                                )}
                                {item.status === 'doing' && (
                                    <Button style={{ color: '#80DF20' }} onClick={() => handleComplete(item)}>
                                        点击完成
                                    </Button>
                                )}
                                {item.status === 'done' && (
                                    <Button style={{ color: '#409FFF' }} onClick={() => handleDetails(item)}>
                                        查看详情
                                    </Button>
                                )}
                            </Card>
                            </List.Item>
                        )}
                    />
                    <Modal title="新建任务" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                      <Row>
                        <Col span={6}>
                          <span>任务名称:</span>
                        </Col>
                        <Col span={18}>
                          <Input
                            placeholder="第一天的任务"
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                          />
                          <span style={{ color: 'grey', fontSize: '0.8em' }}>任务名称为2-20个字</span>
                        </Col>
                      </Row>
                      <br />
                      <Row>
                        <Col span={6}>
                          <span>任务描述:</span>
                        </Col>
                        <Col span={18}>
                          <Input
                            placeholder="熟悉zent组件"
                            value={taskDescription}
                            onChange={(e) => setTaskDescription(e.target.value)}
                          />
                          <span style={{ color: 'grey', fontSize: '0.8em' }}>说说自己要干什么</span>
                        </Col>
                      </Row>
                    </Modal>
                </Card>
            </Col>


        {/* TODO Column */}
        <Col span={6}>
          <Card title={<div style={{textAlign: 'left'}}>TODO</div>}>
              <List
                  itemLayout="horizontal"
                  dataSource={todoTasks}
                  locale={{ emptyText: '暂无任务' }}
                  renderItem={item => (
                      <List.Item>
                      <Card bordered style={{ width: '100%' }}>
                          <List.Item.Meta
                              style={{ textAlign: 'left' }}
                              title={<div>{item.name}</div>}
                              description={<><Divider /><p>{item.details}</p></>}
                          />
                          <Button style={{ color: '#FFBF80' }} onClick={() => handleStart(item)}>
                              点击开始
                          </Button>
                      </Card>
                      </List.Item>
                  )}
              />
          </Card>
        </Col>

        {/* DOING Column */}
        <Col span={6}>
          <Card title={<div style={{textAlign: 'left'}}>DOING</div>}>
              <List
                  itemLayout="horizontal"
                  dataSource={doingTasks}
                  locale={{ emptyText: '暂无任务' }}
                  renderItem={item => (
                      <List.Item>
                      <Card bordered style={{ width: '100%' }}>
                          <List.Item.Meta
                              style={{ textAlign: 'left' }}
                              title={<div>{item.name}</div>}
                              description={<><Divider /><p>{item.details}</p></>}
                          />
                          <Button style={{ color: '	#80DF20' }} onClick={() => handleComplete(item)}>
                              点击完成
                          </Button>
                      </Card>
                      </List.Item>
                  )}
              />
          </Card>
        </Col>

        {/* DONE Column */}
        <Col span={6}>
          <Card title={<div style={{textAlign: 'left'}}>DONE</div>}>
              <List
                  itemLayout="horizontal"
                  dataSource={doneTasks}
                  locale={{ emptyText: '暂无任务' }}
                  renderItem={item => (
                      <List.Item>
                      <Card bordered style={{ width: '100%' }}>
                          <List.Item.Meta
                              style={{ textAlign: 'left' }}
                              title={<div>{item.name}</div>}
                              description={<><Divider /><p>{item.details}</p></>}
                          />
                          <Button style={{ color: '#409FFF' }} onClick={() => handleDetails(item)}>
                              查看详情
                          </Button>
                      </Card>
                      </List.Item>
                  )}
              />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default TodoList;
