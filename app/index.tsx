import React from "react";
import {View, Text, FlatList, TouchableOpacity} from "react-native";
import {FlashList} from "@shopify/flash-list";
import prand from 'pure-rand';

type Item = {
  id: string;
  title: string;
  isChild: boolean;
  childCount: number;
}
const ITEM_HEIGHT = 48;
const SPACING = 8;
const BACKGROUND_0 = '#cccccc';
const BACKGROUND_1 = '#aaaaaa';

const rng = prand.xoroshiro128plus(0);

const DATA: Item[] = Array.from({length: 100}, _ => prand.unsafeUniformIntDistribution(1, 6, rng))
  .flatMap((groupSize) => Array.from({length: groupSize}, (_, i) => ({childCount: i === 0 ? groupSize - 1 : 0, isChild: groupSize > 1 && i > 0})))
  .map((groupData, i) => ({
    id: String(i),
    title: `Item ${i} ${groupData.isChild ? "child" : ""}`,
    ...groupData
  }));

export default function App() {
  const [flashlist, setFlashlist] = React.useState(true);

  if (flashlist) {
    return (
      <FlashList
        data={DATA}
        renderItem={renderItem}
        estimatedItemSize={ITEM_HEIGHT}
        ItemSeparatorComponent={() => <View style={{height: SPACING}} />}
        getItemType={getItemType}
        ListHeaderComponent={() => <TouchableOpacity onPress={() => setFlashlist(false)}><Text style={{height: 50, fontSize: 20, alignContent: 'center', textAlign: 'center'}} >FlashList</Text></TouchableOpacity>}
      />
    );
  }

  return (
    <FlatList
      data={DATA}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <View style={{height: SPACING}} />}
      ListHeaderComponent={() => <TouchableOpacity onPress={() => setFlashlist(true)}><Text style={{height: 50, fontSize: 20, alignContent: 'center', textAlign: 'center'}} >FlatList</Text></TouchableOpacity>}
    />
  );
}

function getItemType(item: Item) {
  const isParent = item.childCount > 0;
  if (isParent) {
    return "parent";
  } else if (item.isChild) {
    return "child";
  }
  return "single";
}


function renderItem({item}: {item: Item}) {
  switch (getItemType(item)) {
    case "parent":
      return (
        <View style={{height: ITEM_HEIGHT + SPACING * 2, paddingHorizontal: SPACING * 2}}>
          <TouchableOpacity onPress={() => {}} style={{
            position: 'absolute',
            height: (item.childCount + 1) * (ITEM_HEIGHT + SPACING) + SPACING,
            backgroundColor: BACKGROUND_0,
            borderRadius: SPACING,
            width: "100%",
            left: SPACING * 2,
          }} >
            <View style={{width: '100%', marginTop: SPACING, height: ITEM_HEIGHT, alignItems: 'center', justifyContent: 'center'}}>
              <Text>{item.title}</Text>
            </View>
          </TouchableOpacity>
        </View>);
    case "child":
      return (<View style={{height: ITEM_HEIGHT, paddingHorizontal: SPACING * 3, zIndex: 1, elevation: 1}}>
        <TouchableOpacity onPress={() => {}} style={{
          position: "absolute",
          width: "100%",
          marginHorizontal: SPACING * 3,
          top: -SPACING,
          height: ITEM_HEIGHT,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: BACKGROUND_1,
          borderRadius: SPACING,
          zIndex: 1,
        }}>
          <Text>{item.title}
          </Text>
        </TouchableOpacity>
      </View>)
    case "single":
      return (
        <View style={{height: ITEM_HEIGHT, paddingHorizontal: SPACING * 2}}>
          <TouchableOpacity onPress={() => {}} style={{
            width: "100%",
            height: ITEM_HEIGHT, backgroundColor: BACKGROUND_0, justifyContent: "center", alignItems: "center", borderRadius: SPACING
          }}>
            <Text>{item.title}
            </Text>
          </TouchableOpacity>
        </View>
      );
  }
}

