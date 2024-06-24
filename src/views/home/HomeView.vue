<template>
  <div class="wrapper">
    <div>
      <div v-for="(chunk, index) in cardChunks" :key="index" class="card-list">
        <a-card
          v-for="card in chunk"
          :key="card.title"
          hoverable
          style="width: 240px"
        >
          <template #cover>
            <img :alt="card.title" :src="card.coverImage" />
          </template>
          <a-card-meta :title="card.title">
            <template #description>{{ card.description }}</template>
          </a-card-meta>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeView",
  data() {
    return {
       cardData: [
        {
          title: "Europe Street beat",
          coverImage:
            "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
          description: "www.instagram.com",
        },
        {
          title: "Card 2",
          coverImage:
            "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
          description: "Description 2",
        },
        {
          title: "Card 3",
          coverImage:
            "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
          description: "Description 3",
        },
        {
          title: "Card 4",
          coverImage:
            "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
          description: "Description 4",
        },
        {
          title: "Card 5",
          coverImage:
            "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
          description: "Description 5",
        },
        {
          title: "Card 6",
          coverImage:
            "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
          description: "Description 6",
        },
        {
          title: "Card 7",
          coverImage:
            "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
          description: "Description 7",
        },
      ],
    };
  },
  computed: {
    cardChunks() {
      const chunkSize = 5;
      const cardData = this.cardData;
      const chunks = [];

      for (let i = 0; i < cardData.length; i += chunkSize) {
        chunks.push(cardData.slice(i, i + chunkSize));
      }

      return chunks;
    }
  }
};
</script>
<style scoped>
.card-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;
}

.card-list > * {
  flex: 0 0 calc(18% - 16px);
}</style>
