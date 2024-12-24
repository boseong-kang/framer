import React, { useState } from "react"

export function HoverImageCloud() {
    const [images, setImages] = useState([])
    const [lastImageTime, setLastImageTime] = useState(0) // 마지막 이미지 생성 시간
    const MAX_IMAGES = 50 // 전체 최대 이미지 수
    const MAX_IMAGES_PER_LOCATION = 2 // 같은 위치 최대 이미지 수
    const DISTANCE_THRESHOLD = 50 // 같은 위치로 간주하는 거리 (픽셀)

    const imageUrls = [
        "https://i.ibb.co/vzQGg26/611620-AE-951-F-4574-A3-D5-A4-C948-D454-FA-1-105-c.jpg",
    ]

    const handleMouseMove = (e) => {
        const now = Date.now()
        if (now - lastImageTime < 100) return // 100ms 딜레이
        setLastImageTime(now)

        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        // 랜덤 크기 설정 (직사각형과 정사각형 섞기)
        const isSquare = Math.random() > 0.5 // 50% 확률로 정사각형 또는 직사각형 선택
        const width = isSquare
            ? Math.random() * 100 + 200 // 정사각형: 가로 200~300px
            : Math.random() * 100 + 200 // 직사각형: 가로 200~300px
        const height = isSquare
            ? width // 정사각형: 세로 = 가로
            : Math.random() * 100 + 300 // 직사각형: 세로 300~400px

        // 새 이미지 정보 생성
        const newImage = {
            id: images.length, // 고유 ID
            url: imageUrls[Math.floor(Math.random() * imageUrls.length)],
            x: x + Math.random() * 50 - 25, // 약간의 랜덤 오프셋
            y: y + Math.random() * 50 - 25,
            width,
            height,
        }

        setImages((prev) => {
            // 같은 위치에 몇 개의 이미지가 있는지 확인
            const overlappingImages = prev.filter(
                (img) =>
                    Math.hypot(img.x - newImage.x, img.y - newImage.y) <
                    DISTANCE_THRESHOLD
            )

            // 조건: 같은 위치에 이미지가 2개 미만이고, 전체 이미지가 50개 미만
            if (
                overlappingImages.length < MAX_IMAGES_PER_LOCATION &&
                prev.length < MAX_IMAGES
            ) {
                return [...prev, newImage]
            }

            return prev // 조건을 만족하지 않으면 이미지 추가하지 않음
        })
    }

    return (
        <div
            onMouseMove={handleMouseMove}
            style={{
                width: "1920px", // 고정된 1920px 너비
                height: "100vh", // 화면 높이 전체
                margin: "0 auto", // 화면 중앙 정렬
                backgroundColor: "transparent", // 배경 투명
                position: "relative",
                overflow: "hidden",
            }}
        >
            {images.map((image) => (
                <div
                    key={image.id}
                    style={{
                        position: "absolute",
                        top: `${image.y}px`,
                        left: `${image.x}px`,
                        width: `${image.width}px`,
                        height: `${image.height}px`,
                        backgroundImage: `url(${image.url})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        pointerEvents: "none",
                    }}
                ></div>
            ))}
        </div>
    )
}
