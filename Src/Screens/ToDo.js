import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert } from 'react-native'
import React, {useEffect} from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useDispatch, useSelector } from 'react-redux';
import { setTaskID, setTasks } from '../Redux/actions';
import GlobalStyle from '../Styles/GlobalStyle';
import CheckBox from '@react-native-community/checkbox';

export default function ToDo({navigation}) {

    const { tasks } = useSelector(state => state.taskReducer);
    const dispatch = useDispatch();

    useEffect(() => {
        getTasks();
    }, [])

////////////////////////////   HOW TO GET THE TASK FUNCTION ///////////////////////////////////////////

    const getTasks = () => {
        AsyncStorage.getItem('Tasks')
            .then(tasks => {
                const parsedTasks = JSON.parse(tasks);
                if (parsedTasks && typeof parsedTasks === 'object') {
                    dispatch(setTasks(parsedTasks));
                }
            })
            .catch(err => console.log(err))
    }
/////////////////////////////  DELETE THE TASK FUNCTION  /////////////////////////////////////////////

    const deleteTask = (id) => {
        const filteredTasks = tasks.filter(task => task.ID !== id);
        AsyncStorage.setItem('Tasks', JSON.stringify(filteredTasks))
            .then(() => {
                dispatch(setTasks(filteredTasks));
                Alert.alert('Success!', 'Task removed successfully.');
            })
            .catch(err => console.log(err))
    }

//////////////////////////////////  CHECK BOX FUNCTION   ////////////////////////////////////////////

    const checkTask = (id, newValue) => {
        const index = tasks.findIndex(task => task.ID === id);
        if (index > -1) {
            let newTasks = [...tasks];
            newTasks[index].Done = newValue;
            AsyncStorage.setItem('Tasks', JSON.stringify(newTasks))
                .then(() => {
                    dispatch(setTasks(newTasks));
                    Alert.alert('Success!', 'Task state is changed.');
                })
                .catch(err => console.log(err))
        }
    }

  return (
    <View style = {styles.body}>

            <FlatList
                data={tasks.filter(task => task.Done === false)}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.item}
                        onPress={() => {
                            dispatch(setTaskID(item.ID));
                            navigation.navigate('Task');
                        }}
                    >
            <View style = {styles.item_row}>
                
{/* ////////////////////////////   CHECK BOX COLORED BAR IMPLIMENTED ON TASK LIST    ////////////////// */}
                <View 
                style = {[
                    {
                        backgroundColor: 
                            item.Color === 'red' ? '#f28b82' :
                            item.Color === 'blue' ? '#aecbfa' :
                            item.Color === 'green' ? '#ccff90' : '#ffffff'
                    },
                    styles.color]}
                />

{/* ////////////////////////////////////   CHECKBOX  /////////////////////////////////////////// */}

            <CheckBox
                value={item.Done} 
                onValueChange = {(newValue) => {checkTask(item.ID , newValue)}}
            />

{/* /////////////////////////////////    STYLES AND CODE OF TITLE AND SUBTITLE  /////////////////////// */}
                
                <View style = {styles.item_body}>
                        <Text
                            style={[
                                GlobalStyle.CustomFontHW,
                                styles.title
                            ]}
                            numberOfLines={1}
                        >
                            {item.Title}
                        </Text>
                        <Text
                            style={[
                                GlobalStyle.CustomFontHW,
                                styles.subtitle
                            ]}
                            numberOfLines={1}
                        >
                            {item.Desc}
                        </Text>
                </View>

{/* //////////////////////////////   DELETE ICON BUTTON  /////////////////////////////////////// */}

                <TouchableOpacity
                    style={styles.delete}
                   onPress ={() =>{deleteTask(item.ID)}}
                    >
                        <FontAwesome5
                        name={'trash'}
                        size={20}
                        color={'#ff3636'}
                         />
                </TouchableOpacity>
            </View>
                    </TouchableOpacity>

                )}
                keyExtractor={(item, index) => index.toString()}
            />

{/* //////////////////////////////   SAVE THE TASK BUTTON  //////////////////////////////////////// */}

        <TouchableOpacity style = {styles.button}
        onPress={() => {
            dispatch(setTaskID(tasks.length + 1)); 
            navigation.navigate('Task');
        }}
        >
            <FontAwesome5
                    name={'plus'}
                    size={20}
                    color={'#ffffff'}
                />
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: 'lightblue'
    },
    button: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#0080ff',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 10,
        right: 10,
        elevation: 5,
    },
    item: {
        marginHorizontal: 10,
        marginVertical: 7,
        paddingRight: 10,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        borderRadius: 10,
        elevation: 5,
    },
    title: {
        color: '#000000',
        fontSize: 28,
        margin: 5,
    },
    subtitle: {
        color: '#999999',
        fontSize: 20,
        margin: 5,
    },
    item_row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    item_body: {
        flex: 1,
    },
    delete: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    color: {
        width: 20,
        height: 100,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
})