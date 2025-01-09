import {StyleSheet, Text, View} from 'react-native';

const HomeStyle = StyleSheet.create({
  txt__user: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  hello: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  genderSelection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  arrowDown: {
    marginLeft: 5,
  },
  Search__Icon: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 15,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  seeAllText: {
    fontSize: 14,
    color: '#000',
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  categoryItem: {
    marginRight: 30,
    alignItems: 'center',
  },
  categoryImage: {
    width: 67,
    height: 67,
    borderRadius: 30,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  productSection: {
    marginBottom: 40,
  },
  productCard: {
    height: 200,
    width: 190,
    backgroundColor: '#F4F4F4',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    marginTop: 20,
    position: 'relative',
  },
  productImage: {
    width: 160,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    color: '#000',
  },
  productPrice: {
    fontSize: 16,
    color: '#ff5722',
    textAlign: 'center',
  },
  heartIcon: {
    top: 8, 
    right: 8, 
    zIndex: 10, 
    width: 24, 
    height: 24,
    position: 'absolute',
  },

});

export default HomeStyle;